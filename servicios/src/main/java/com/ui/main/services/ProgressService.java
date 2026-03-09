package com.ui.main.services;

import com.ui.main.model.dto.PagedUsersWithExperienceStatusRes;
import com.ui.main.model.dto.ProgressMeRes;
import com.ui.main.model.dto.UserWithExperienceStatusRes;
import com.ui.main.repository.ModuleProgressRepository;
import com.ui.main.repository.UserRepository;
import com.ui.main.repository.entity.ModuleProgressEntity;
import com.ui.main.repository.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private static final int TOTAL_MODULOS = 6;

    private final ExternalProgressService external;
    private final UserRepository users;
    private final ModuleProgressRepository moduleProgress;

    // -------------------------------------------------------------------------
    // Progreso personal del usuario autenticado
    // -------------------------------------------------------------------------

    public Mono<ProgressMeRes> getMyProgress(String email) {
        return users.findByEmailIgnoreCase(email)
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                .flatMap(u -> {
                    Mono<ExternalProgressService.MonedaDto> monedaMono =
                            external.readByDni(u.getDni());

                    Mono<List<ModuleProgressEntity>> modulosMono =
                            moduleProgress.findAllByEmailIgnoreCase(email).collectList();

                    return Mono.zip(monedaMono, modulosMono)
                            .map(t -> buildProgressMeRes(t.getT1(), t.getT2()));
                });
    }

    private ProgressMeRes buildProgressMeRes(
            ExternalProgressService.MonedaDto monedas,
            List<ModuleProgressEntity> entities
    ) {
        Map<Integer, ModuleProgressEntity> byModulo = entities.stream()
                .collect(Collectors.toMap(ModuleProgressEntity::getModulo, Function.identity()));

        // General module (modulo = 0): testInicialGeneral + testFinalGeneral
        ModuleProgressEntity generalEntity = byModulo.get(0);
        ProgressMeRes.GeneralProgress general = generalEntity == null
                ? ProgressMeRes.GeneralProgress.empty()
                : new ProgressMeRes.GeneralProgress(
                        generalEntity.isTestInitialDone(),
                        generalEntity.isTestExitDone(),
                        generalEntity.isAvatarDone());

        List<ProgressMeRes.ModuloProgress> modulos = IntStream.rangeClosed(1, TOTAL_MODULOS)
                .mapToObj(n -> {
                    ModuleProgressEntity e = byModulo.get(n);
                    if (e == null) return ProgressMeRes.ModuloProgress.empty(n);
                    return new ProgressMeRes.ModuloProgress(
                            n,
                            e.isTestInitialDone(),
                            e.isTestExitDone(),
                            e.isCalificationDone(),
                            e.isIntroduccionDone(),
                            e.isPdf1Done(),
                            e.isPdf2Done(),
                            e.isPdf3Done(),
                            e.isPdf4Done(),
                            e.isQuiz1Done(),
                            e.isQuiz2Done(),
                            e.isQuiz3Done(),
                            e.isQuiz4Done()
                    );
                })
                .toList();

        ProgressMeRes.MonedaStatus monedaStatus = new ProgressMeRes.MonedaStatus(
                monedas.isMoneda1(),
                monedas.isMoneda2(), monedas.isMoneda3(),
                monedas.isMoneda4(), monedas.isMoneda5(), monedas.isMoneda6()
        );

        return new ProgressMeRes(general, modulos, monedaStatus);
    }

    // -------------------------------------------------------------------------
    // Marcar avance en un módulo (test-inicial | test-salida | calificacion)
    // -------------------------------------------------------------------------

    public Mono<Void> markTestDone(String email, int modulo, String type) {
        if (modulo < 0 || modulo > TOTAL_MODULOS) {
            return Mono.error(new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "modulo debe estar entre 0 y " + TOTAL_MODULOS
                            + " (0 = módulo general)"));
        }

        return users.findByEmailIgnoreCase(email)
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                .flatMap(u ->
                        moduleProgress.findByEmailIgnoreCaseAndModulo(email, modulo)
                                .defaultIfEmpty(ModuleProgressEntity.builder()
                                        .userId(u.getId())
                                        .email(email.toLowerCase())
                                        .modulo(modulo)
                                        .build())
                                .flatMap(entity -> {
                                    switch (type.toLowerCase()) {
                                        case "test-inicial"   -> entity.setTestInitialDone(true);
                                        case "test-salida"    -> entity.setTestExitDone(true);
                                        case "calificacion"   -> entity.setCalificationDone(true);
                                        case "introduccion"   -> entity.setIntroduccionDone(true);
                                        case "pdf1"           -> entity.setPdf1Done(true);
                                        case "pdf2"           -> entity.setPdf2Done(true);
                                        case "pdf3"           -> entity.setPdf3Done(true);
                                        case "pdf4"           -> entity.setPdf4Done(true);
                                        case "avatar"         -> entity.setAvatarDone(true);
                                        default -> throw new ResponseStatusException(
                                                HttpStatus.BAD_REQUEST,
                                                "type inválido: usa 'test-inicial', 'test-salida', 'calificacion', 'introduccion', 'pdf1'-'pdf4', 'quiz1'-'quiz4' o 'avatar'");
                                    }
                                    entity.setUpdatedAt(LocalDateTime.now());
                                    return moduleProgress.save(entity);
                                })
                )
                .then();
    }

    // -------------------------------------------------------------------------
    // Marcar avance de quiz en un módulo (puede marcarse como hecho o no hecho)
    // -------------------------------------------------------------------------

    public Mono<Void> markQuizDone(String email, int modulo, int quiz, boolean done) {
        if (modulo < 1 || modulo > TOTAL_MODULOS) {
            return Mono.error(new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "modulo debe estar entre 1 y " + TOTAL_MODULOS));
        }
        if (quiz < 1 || quiz > 4) {
            return Mono.error(new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "quiz debe estar entre 1 y 4"));
        }

        return users.findByEmailIgnoreCase(email)
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                .flatMap(u ->
                        moduleProgress.findByEmailIgnoreCaseAndModulo(email, modulo)
                                .defaultIfEmpty(ModuleProgressEntity.builder()
                                        .userId(u.getId())
                                        .email(email.toLowerCase())
                                        .modulo(modulo)
                                        .build())
                                .flatMap(entity -> {
                                    switch (quiz) {
                                        case 1 -> entity.setQuiz1Done(done);
                                        case 2 -> entity.setQuiz2Done(done);
                                        case 3 -> entity.setQuiz3Done(done);
                                        case 4 -> entity.setQuiz4Done(done);
                                    }
                                    entity.setUpdatedAt(LocalDateTime.now());
                                    return moduleProgress.save(entity);
                                })
                )
                .then();
    }

    // -------------------------------------------------------------------------
    // Panel de administrador
    // -------------------------------------------------------------------------

    public Mono<PagedUsersWithExperienceStatusRes> getUsersExperienceStatusPage(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);

        Mono<List<ExternalProgressService.UserProgressDto>> progressMono = external.readAll();
        Mono<Long> totalUsersMono = users.count();
        Mono<List<UserEntity>> pageUsersMono = users.findAll()
                .skip((long) safePage * safeSize)
                .take(safeSize)
                .collectList();
        Mono<Map<String, List<ModuleProgressEntity>>> modulesMono =
                moduleProgress.findAll()
                        .collectList()
                        .map(list -> list.stream().collect(Collectors.groupingBy(
                                e -> e.getEmail() == null ? "" : e.getEmail().toLowerCase())));

        return Mono.zip(progressMono, totalUsersMono, pageUsersMono, modulesMono)
                .map(t -> {
                    List<UserWithExperienceStatusRes> mapped = t.getT3().stream()
                            .map(u -> {
                                String key = u.getEmail() == null ? "" : u.getEmail().toLowerCase();
                                List<ModuleProgressEntity> mods = t.getT4().getOrDefault(key, List.of());
                                return UserWithExperienceStatusRes.of(u, computeExperienceStatus(u, mods, t.getT1()));
                            })
                            .toList();
                    return PagedUsersWithExperienceStatusRes.builder()
                            .userList(mapped)
                            .totalUsers(t.getT2())
                            .page(safePage)
                            .size(safeSize)
                            .build();
                });
    }

    public Flux<UserWithExperienceStatusRes> getAllUsersExperienceStatus() {
        Mono<List<ExternalProgressService.UserProgressDto>> progressMono = external.readAll();
        Mono<Map<String, List<ModuleProgressEntity>>> modulesMono =
                moduleProgress.findAll()
                        .collectList()
                        .map(list -> list.stream().collect(Collectors.groupingBy(
                                e -> e.getEmail() == null ? "" : e.getEmail().toLowerCase())));

        return Mono.zip(progressMono, modulesMono)
                .flatMapMany(t -> users.findAll()
                        .map(u -> {
                            String key = u.getEmail() == null ? "" : u.getEmail().toLowerCase();
                            List<ModuleProgressEntity> mods = t.getT2().getOrDefault(key, List.of());
                            return UserWithExperienceStatusRes.of(u, computeExperienceStatus(u, mods, t.getT1()));
                        }));
    }

    /**
     * Computes a 0–100 progress score using the same formula as the frontend:
     *   modulo 0 testInitialDone → +5 pts
     *   modulo 0 testExitDone    → +5 pts
     *   each module 1–6         → up to +15 pts (proportional to 8 DB flags)
     */
    private int computeExperienceStatus(
            UserEntity u,
            List<ModuleProgressEntity> modules,
            List<ExternalProgressService.UserProgressDto> extProgress
    ) {
        Map<Integer, ModuleProgressEntity> byModulo = modules.stream()
                .collect(Collectors.toMap(ModuleProgressEntity::getModulo, Function.identity()));

        int score = 0;

        ModuleProgressEntity gen = byModulo.get(0);
        if (gen != null) {
            if (gen.isTestInitialDone()) score += 5;
            if (gen.isTestExitDone())    score += 5;
        }

        for (int n = 1; n <= TOTAL_MODULOS; n++) {
            ModuleProgressEntity e = byModulo.get(n);
            if (e == null) continue;
            int flags = 0;
            if (e.isIntroduccionDone())  flags++;
            if (e.isTestInitialDone())   flags++;
            if (e.isQuiz1Done())         flags++;
            if (e.isQuiz2Done())         flags++;
            if (e.isQuiz3Done())         flags++;
            if (e.isQuiz4Done())         flags++;
            if (e.isTestExitDone())      flags++;
            if (e.isCalificationDone())  flags++;
            score += (int) Math.round((double) flags / 8.0 * 15.0);
        }

        return Math.min(score, 100);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private static ExternalProgressService.UserProgressDto findByDni(
            List<ExternalProgressService.UserProgressDto> list, String dni) {
        if (dni == null) return null;
        String ndni = dni.trim();
        return list.stream()
                .filter(p -> ndni.equals(p.getIdEstudiante()))
                .findFirst()
                .orElse(null);
    }
}

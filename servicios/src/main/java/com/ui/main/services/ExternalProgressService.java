package com.ui.main.services;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExternalProgressService {

    private final WebClient nivel99Client;

    public Mono<MonedaDto> readByDni(String dni) {
        return nivel99Client.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movilidad/api/usuarios.php")
                        .queryParam("cedula", dni)
                        .build())
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, rsp ->
                        rsp.bodyToMono(String.class)
                                .defaultIfEmpty("4xx from nivel99")
                                .map(msg -> new ResponseStatusException(HttpStatus.BAD_GATEWAY, "nivel99 4xx: " + msg))
                )
                .onStatus(HttpStatusCode::is5xxServerError, rsp ->
                        rsp.bodyToMono(String.class)
                                .defaultIfEmpty("5xx from nivel99")
                                .map(msg -> new ResponseStatusException(HttpStatus.BAD_GATEWAY, "nivel99 5xx: " + msg))
                )
                .bodyToMono(MonedaDto.class)
                .defaultIfEmpty(MonedaDto.none())
                .onErrorReturn(MonedaDto.none());
    }

    public Mono<List<UserProgressDto>> readAll() {
        return nivel99Client.get()
                .uri("/UniminutoBackend/leer_usuarios.php")
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, rsp ->
                        rsp.bodyToMono(String.class)
                                .defaultIfEmpty("4xx from nivel99")
                                .map(msg -> new ResponseStatusException(HttpStatus.BAD_GATEWAY, "nivel99 4xx: " + msg))
                )
                .onStatus(HttpStatusCode::is5xxServerError, rsp ->
                        rsp.bodyToMono(String.class)
                                .defaultIfEmpty("5xx from nivel99")
                                .map(msg -> new ResponseStatusException(HttpStatus.BAD_GATEWAY, "nivel99 5xx: " + msg))
                )
                .bodyToMono(Nivel99ReadResponse.class)
                .map(resp -> {
                    if (resp == null || resp.params() == null || resp.params().usuarios() == null)
                        return List.of();
                    return resp.params().usuarios().stream()
                            .map(UserProgressDto::fromNivel)
                            .toList();
                });
    }

    public Mono<Boolean> upsertMedals(String idEstudiante, boolean m1, boolean m2, boolean m3, boolean m4) {
        return nivel99Client.post()
                .uri("/UniminutoBackend/guardar_usuario.php")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters
                        .fromFormData("id_estudiante", idEstudiante)  
                        .with("medalla1", m1 ? "Si" : "No")
                        .with("medalla2", m2 ? "Si" : "No")
                        .with("medalla3", m3 ? "Si" : "No")
                        .with("medalla4", m4 ? "Si" : "No"))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, rsp ->
                        rsp.bodyToMono(String.class)
                                .defaultIfEmpty("4xx from nivel99")
                                .map(msg -> new ResponseStatusException(HttpStatus.BAD_GATEWAY, "nivel99 4xx: " + msg))
                )
                .onStatus(HttpStatusCode::is5xxServerError, rsp ->
                        rsp.bodyToMono(String.class)
                                .defaultIfEmpty("5xx from nivel99")
                                .map(msg -> new ResponseStatusException(HttpStatus.BAD_GATEWAY, "nivel99 5xx: " + msg))
                )
                .bodyToMono(Nivel99WriteResponse.class)
                .map(r -> r != null && r.params() != null && "success".equalsIgnoreCase(r.params().Result()));
    }

    // -------------------------------------------------------------------------
    // DTOs
    // -------------------------------------------------------------------------

    /** Respuesta del endpoint individual: /movilidad/api/usuarios.php?cedula=:dni */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor(staticName = "of")
    public static class MonedaDto {
        private String moneda1, moneda2, moneda3, moneda4, moneda5, moneda6;

        public boolean isMoneda1() { return parseSi(moneda1); }
        public boolean isMoneda2() { return parseSi(moneda2); }
        public boolean isMoneda3() { return parseSi(moneda3); }
        public boolean isMoneda4() { return parseSi(moneda4); }
        public boolean isMoneda5() { return parseSi(moneda5); }
        public boolean isMoneda6() { return parseSi(moneda6); }

        public static MonedaDto none() {
            return of("No", "No", "No", "No", "No", "No");
        }

        private static boolean parseSi(String s) {
            return s != null && s.trim().equalsIgnoreCase("si");
        }
    }

    @Data
    @AllArgsConstructor(staticName = "of")
    public static class UserProgressDto {
        private String idEstudiante;
        private boolean medalla1, medalla2, medalla3, medalla4;

        public static UserProgressDto fromNivel(Nivel99ReadResponse.NUser u) {
            return of(
                    u.id_estudiante(),
                    parseSi(u.medalla1()),
                    parseSi(u.medalla2()),
                    parseSi(u.medalla3()),
                    parseSi(u.medalla4())
            );
        }

        private static boolean parseSi(String s) {
            return s != null && s.trim().equalsIgnoreCase("si");
        }
    }

    public record Nivel99ReadResponse(Params params) {
        public record Params(String Result, List<NUser> usuarios) {
        }

        public record NUser(String id_estudiante, String medalla1, String medalla2, String medalla3, String medalla4) {
        }
    }

    public record Nivel99WriteResponse(Params params) {
        public record Params(String Result) {
        }
    }
}
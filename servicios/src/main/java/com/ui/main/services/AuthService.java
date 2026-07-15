package com.ui.main.services;

import com.ui.main.exception.ApiErrorException;
import com.ui.main.model.dto.SignupReq;
import com.ui.main.repository.UserRepository;
import com.ui.main.repository.entity.UserEntity;
import com.ui.main.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    // =========================
    //  Validadores de formato
    // =========================

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    private static final Pattern DNI_PATTERN = Pattern.compile("^[0-9]{5,15}$");

    private boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    private boolean isValidDni(String dni) {
        return dni != null && DNI_PATTERN.matcher(dni).matches();
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    private String normalizeDni(String dni) {
        return dni == null ? null : dni.trim();
    }

    private Mono<Void> validateIdentityFormat(String email, String dni) {
        if (!isValidEmail(email)) {
            return Mono.error(new ApiErrorException(
                    HttpStatus.BAD_REQUEST,
                    "Ingresa un correo electrónico válido.",
                    "INVALID_EMAIL",
                    "email"
            ));
        }

        if (!isValidDni(dni)) {
            return Mono.error(new ApiErrorException(
                    HttpStatus.BAD_REQUEST,
                    "Ingresa un número de documento válido.",
                    "INVALID_DNI",
                    "dni"
            ));
        }

        return Mono.empty();
    }

    /**
     * Recuperación de contraseña FLEXIBLE: la persona escribe correo y documento,
     * y basta con que UNO de los dos coincida con una cuenta registrada (por si se
     * equivocó al escribir el otro). Reglas:
     *   - Si ninguno coincide → NOT_FOUND.
     *   - Si ambos coinciden pero apuntan a cuentas distintas → ambiguo, se rechaza.
     *   - Si coincide al menos uno → se resuelve esa cuenta.
     * La cuenta resuelta debe estar habilitada.
     */
    private Mono<UserEntity> resolveRecoveryAccount(String email, String dni) {
        String normEmail = normalizeEmail(email);
        String normDni = normalizeDni(dni);

        boolean hasEmail = normEmail != null && !normEmail.isBlank();
        boolean hasDni = normDni != null && !normDni.isBlank();

        if (!hasEmail && !hasDni) {
            return Mono.error(new ApiErrorException(
                    HttpStatus.BAD_REQUEST,
                    "Ingresa tu correo electrónico y tu número de documento.",
                    "MISSING_IDENTITY",
                    null
            ));
        }

        Mono<Optional<UserEntity>> byEmail = hasEmail
                ? users.findByEmailIgnoreCase(normEmail).map(Optional::of).defaultIfEmpty(Optional.empty())
                : Mono.just(Optional.empty());
        Mono<Optional<UserEntity>> byDni = hasDni
                ? users.findByDni(normDni).map(Optional::of).defaultIfEmpty(Optional.empty())
                : Mono.just(Optional.empty());

        return Mono.zip(byEmail, byDni).flatMap(tuple -> {
            Optional<UserEntity> foundByEmail = tuple.getT1();
            Optional<UserEntity> foundByDni = tuple.getT2();

            if (foundByEmail.isEmpty() && foundByDni.isEmpty()) {
                return Mono.error(new ApiErrorException(
                        HttpStatus.NOT_FOUND,
                        "No encontramos ninguna cuenta con ese correo ni ese número de documento.",
                        "ACCOUNT_NOT_FOUND",
                        null
                ));
            }

            UserEntity account;
            if (foundByEmail.isPresent() && foundByDni.isPresent()) {
                if (!foundByEmail.get().getId().equals(foundByDni.get().getId())) {
                    return Mono.error(new ApiErrorException(
                            HttpStatus.BAD_REQUEST,
                            "El correo y el número de documento pertenecen a cuentas distintas. Verifica los datos.",
                            "IDENTITY_MISMATCH",
                            null
                    ));
                }
                account = foundByEmail.get();
            } else {
                account = foundByEmail.orElseGet(foundByDni::get);
            }

            if (!Boolean.TRUE.equals(account.getEnabled())) {
                return Mono.error(new ApiErrorException(
                        HttpStatus.CONFLICT,
                        "Esta cuenta está deshabilitada. Contacta al administrador.",
                        "ACCOUNT_DISABLED",
                        null
                ));
            }

            return Mono.just(account);
        });
    }

    /**
     * Verifica que exista una cuenta recuperable con el correo y/o el documento.
     * Usado por el paso 1 del flujo de "recuperar contraseña".
     */
    public Mono<Boolean> verifyIdentity(String email, String dni) {
        return resolveRecoveryAccount(email, dni).thenReturn(true);
    }

    // =========================
    //  RESET PASSWORD
    // =========================

    public Mono<Void> resetPassword(String email, String dni, String newRawPassword) {
        if (newRawPassword == null || newRawPassword.length() < 8) {
            return Mono.error(new ApiErrorException(
                    HttpStatus.BAD_REQUEST,
                    "La contraseña debe tener mínimo 8 caracteres.",
                    "WEAK_PASSWORD",
                    "newPassword"
            ));
        }

        return resolveRecoveryAccount(email, dni)
                .flatMap(u -> hashPassword(newRawPassword)
                        .flatMap(hash -> {
                            u.setPasswordHash(hash);
                            return users.save(u).then();
                        }));
    }

    /**
     * bcrypt.encode es pesado (CPU) y bloqueante. En una app reactiva NUNCA debe
     * correr sobre el event loop de Netty, o satura los pocos hilos disponibles y
     * las peticiones concurrentes fallan ("Failed to fetch" en el cliente).
     * Lo movemos al scheduler boundedElastic, pensado para trabajo bloqueante.
     */
    private Mono<String> hashPassword(String rawPassword) {
        return Mono.fromCallable(() -> encoder.encode(rawPassword))
                .subscribeOn(Schedulers.boundedElastic());
    }

    // =========================
    //  SIGNUP FLEXIBLE
    // =========================

    public Mono<Void> signup(SignupReq req) {
        String norm = normalizeEmail(req.getEmail());
        String normalizedDni = normalizeDni(req.getDni());
        log.info("Signup requested for email={} dni={}", norm, normalizedDni);

        if (req.getPassword() == null || req.getPassword().length() < 8) {
            return Mono.error(new ApiErrorException(
                    HttpStatus.BAD_REQUEST,
                    "La contraseña debe tener mínimo 8 caracteres.",
                    "WEAK_PASSWORD",
                    "password"
            ));
        }

        return validateIdentityFormat(norm, normalizedDni)
                .then(users.findByEmailIgnoreCase(norm)
                        .flatMap(existingUser ->
                            Mono.<UserEntity>error(new ApiErrorException(
                                    HttpStatus.CONFLICT,
                                    "Ya existe una cuenta registrada con este correo electrónico.",
                                    "DUPLICATE_EMAIL",
                                    "email"
                            ))
                        )
                )
                .then(users.findByDni(normalizedDni)
                        .flatMap(existingUser ->
                                Mono.<UserEntity>error(new ApiErrorException(
                                        HttpStatus.CONFLICT,
                                        "Ya existe una cuenta registrada con este número de documento.",
                                        "DUPLICATE_DNI",
                                        "dni"
                                ))
                        )
                )
                .then(Mono.defer(() -> hashPassword(req.getPassword())
                        .flatMap(hash -> users.save(buildUserForSignup(req, hash)))
                        .then()))
                .onErrorMap(DuplicateKeyException.class, ex -> new ApiErrorException(
                        HttpStatus.CONFLICT,
                        "Ya existe una cuenta registrada con este correo o número de documento.",
                        "DUPLICATE_ACCOUNT",
                        null
                ));
    }

    // =========================
    //  Helpers de construcción
    // =========================

    /**
     * Correos que reciben rol ADMIN automáticamente al registrarse,
     * sin importar la contraseña que elijan.
     * Agregar o eliminar entradas aquí para gestionar los admins predefinidos.
     */
    private static final Set<String> ADMIN_EMAILS = Set.of(
        "coordinadorparticipacion@gmail.com"
        // Agrega más correos aquí, por ejemplo:
        // "otro@ejemplo.com"
    );

    /**
     * Contraseña maestra alternativa para registrarse como ADMIN
     * (se mantiene como método de respaldo).
     */
    private static final String ADMIN_MASTER_PASSWORD = "VIALADMIN2026*";

    private UserEntity buildUserForSignup(SignupReq req, String passwordHash) {
        String emailNorm = normalizeEmail(req.getEmail());
        String role = (ADMIN_EMAILS.contains(emailNorm) || ADMIN_MASTER_PASSWORD.equals(req.getPassword()))
                ? "ADMIN" : "USER";
        return UserEntity.builder()
                .email(emailNorm)
                .dni(normalizeDni(req.getDni()))
                .fullName(req.getFullName())
                .documentType(req.getDocumentType())
                .department(req.getDepartment())
                .municipality(req.getMunicipality())
                .phone(req.getPhone())
                .genero(req.getGender())
                .ageRange(req.getAgeRange())
                .differentialFocus(req.getDifferentialFocus())
                .avatarId(0)
                .passwordHash(passwordHash)
                .role(role)
                .enabled(true)
                .initialTestDone(false)
                .exitTestDone(false)
                .build();
    }

    // =========================
    //  LOGIN (por correo o documento)
    // =========================

    /**
     * El identificador puede ser el correo electrónico o el número de documento.
     * Si tiene forma de correo se busca por email; en caso contrario se trata
     * como documento (cédula, TI, etc.) y se busca por dni.
     */
    public Mono<String> login(String identifier, String password) {
        String id = identifier == null ? null : identifier.trim();

        Mono<UserEntity> userMono = isValidEmail(id)
                ? users.findByEmailIgnoreCase(normalizeEmail(id))
                : users.findByDni(normalizeDni(id));

        return userMono
                .switchIfEmpty(Mono.error(new ApiErrorException(
                        HttpStatus.UNAUTHORIZED,
                        "Correo/documento o contraseña incorrectos. Revisa los datos e inténtalo de nuevo.",
                        "INVALID_CREDENTIALS",
                        null
                )))
                .flatMap(u -> {
                    if (!Boolean.TRUE.equals(u.getEnabled())) {
                        return Mono.<String>error(new ApiErrorException(
                                HttpStatus.UNAUTHORIZED,
                                "Correo/documento o contraseña incorrectos. Revisa los datos e inténtalo de nuevo.",
                                "INVALID_CREDENTIALS",
                                null
                        ));
                    }
                    // bcrypt.matches es pesado (CPU): fuera del event loop reactivo.
                    return Mono.fromCallable(() -> encoder.matches(password, u.getPasswordHash()))
                            .subscribeOn(Schedulers.boundedElastic())
                            .flatMap(matches -> {
                                if (!Boolean.TRUE.equals(matches)) {
                                    return Mono.<String>error(new ApiErrorException(
                                            HttpStatus.UNAUTHORIZED,
                                            "Correo o contraseña incorrectos. Revisa los datos e inténtalo de nuevo.",
                                            "INVALID_CREDENTIALS",
                                            null
                                    ));
                                }
                                var claims = Map.<String, Object>of(
                                        "uid", u.getId(),
                                        "role", u.getRole(),
                                        "avatarId", u.getAvatarId()
                                );
                                return Mono.just(jwt.generate(u.getEmail(), claims));
                            });
                });
    }
}

package com.ui.main.services;

import com.ui.main.model.dto.SignupReq;
import com.ui.main.repository.UserRepository;
import com.ui.main.repository.entity.UserEntity;
import com.ui.main.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.Map;
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

    /**
     * AHORA: verifyIdentity solo valida FORMATO de email y cédula.
     * Ya no consulta el roster.
     */
    public Mono<Boolean> verifyIdentity(String email, String dni) {
        String norm = email == null ? null : email.trim().toLowerCase();

        if (!isValidEmail(norm)) {
            return Mono.error(new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Correo electrónico inválido"
            ));
        }

        if (!isValidDni(dni)) {
            return Mono.error(new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Número de documento inválido"
            ));
        }

        return Mono.just(true);
    }

    // =========================
    //  RESET PASSWORD
    // =========================

    public Mono<Void> resetPassword(String email, String dni, String newRawPassword) {
        String norm = email.toLowerCase();

        if (newRawPassword.length() < 8) {
            return Mono.error(new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Contraseña insegura (mínimo 8 caracteres)"
            ));
        }

        return verifyIdentity(norm, dni)
                .then(users.findByEmailIgnoreCase(norm)
                        .switchIfEmpty(Mono.error(new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "Cuenta no registrada"
                        ))))
                .flatMap(u -> {
                    if (!dni.equals(u.getDni())) {
                        return Mono.error(new ResponseStatusException(
                                HttpStatus.BAD_REQUEST, "No coincide email/cédula"
                        ));
                    }

                    if (!Boolean.TRUE.equals(u.getEnabled())) {
                        return Mono.error(new ResponseStatusException(
                                HttpStatus.CONFLICT, "Cuenta deshabilitada"
                        ));
                    }

                    u.setPasswordHash(encoder.encode(newRawPassword));
                    return users.save(u).then();
                });
    }

    // =========================
    //  SIGNUP FLEXIBLE
    // =========================

    public Mono<Void> signup(SignupReq req) {
        log.info(req.toString());
        String norm = req.getEmail().toLowerCase();

        if (req.getPassword().length() < 8) {
            return Mono.error(new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Contraseña insegura (mínimo 8 caracteres)"
            ));
        }

        return verifyIdentity(norm, req.getDni())
                .then(users.findByEmailIgnoreCase(norm)
                        .flatMap(existingUser ->
                            Mono.error(new ResponseStatusException(
                                    HttpStatus.CONFLICT, "Cuenta ya registrada"
                            ))
                        )
                        .switchIfEmpty(Mono.just(true))
                )
                .then(Mono.just(buildUserForSignup(req)))
                .flatMap(users::save)
                .then();
    }

    // =========================
    //  Helpers de construcción
    // =========================

    /**
     * Usuario nuevo - Usa los datos proporcionados en SignupReq.
     */
    private UserEntity buildUserForSignup(SignupReq req) {
        return UserEntity.builder()
                .email(req.getEmail().toLowerCase())
                .dni(req.getDni())
                .fullName(req.getFullName())
                .documentType(req.getDocumentType())
                .department(req.getDepartment())
                .municipality(req.getMunicipality())
                .phone(req.getPhone())
                .genero(req.getGender())
                .ageRange(req.getAgeRange())
                .differentialFocus(req.getDifferentialFocus())
                .avatarId(0)
                .passwordHash(encoder.encode(req.getPassword()))
                .role("USER")
                .enabled(true)
                .initialTestDone(false)
                .exitTestDone(false)
                .build();
    }

    // =========================
    //  LOGIN (igual que antes)
    // =========================

    public Mono<String> login(String email, String password) {
        String norm = email.toLowerCase();
        return users.findByEmailIgnoreCase(norm)
                .switchIfEmpty(Mono.error(new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Credenciales inválidas"
                )))
                .flatMap(u -> {
                    if (!Boolean.TRUE.equals(u.getEnabled())
                            || !encoder.matches(password, u.getPasswordHash())) {
                        return Mono.error(new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED, "Credenciales inválidas"
                        ));
                    }
                    var claims = Map.<String, Object>of(
                            "uid", u.getId(),
                            "role", u.getRole(),
                            "avatarId", u.getAvatarId()
                    );
                    return Mono.just(jwt.generate(u.getEmail(), claims));
                });
    }
}
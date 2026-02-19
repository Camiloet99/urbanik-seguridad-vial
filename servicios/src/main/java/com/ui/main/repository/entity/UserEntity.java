package com.ui.main.repository.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Table("users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    @Id
    private Long id;

    private String email;
    private String dni;

    @Column("full_name")
    private String fullName;

    private String genero;

    @Column("age_range")
    private String ageRange;

    @Column("fecha_nacimiento")
    private LocalDate fechaNacimiento;

    private String phone;
    private String telefono;
    private String celular;

    @Column("email_personal")
    private String emailPersonal;

    @Column("ciudad_residencia")
    private String ciudadResidencia;

    private String subregion;

    @Column("tipo_documento_id")
    private String tipoDocumentoId;
    
    @Column("document_type")
    private String documentType;

    private String department;
    private String municipality;

    @Column("enfoque_diferencial")
    private String differentialFocus;
    
    private String programa;
    private String nivel;

    @Column("avatar_id")
    private Integer avatarId;

    @Column("password_hash")
    private String passwordHash;

    private String role;
    private Boolean enabled;

    @Column("initial_test_done")
    private Boolean initialTestDone;

    @Column("exit_test_done")
    private Boolean exitTestDone;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("updated_at")
    private LocalDateTime updatedAt;
}

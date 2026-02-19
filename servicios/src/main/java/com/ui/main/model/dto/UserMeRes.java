package com.ui.main.model.dto;

import com.ui.main.repository.entity.UserEntity;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class UserMeRes {
    private Long id;
    private String email;
    private String dni;
    private String fullName;
    private String documentType;
    private String genero;
    private String ageRange;
    private String department;
    private String municipality;
    private String phone;
    private LocalDate fechaNacimiento;

    private String emailPersonal;
    private String ciudadResidencia;
    private String subregion;
    private String tipoDocumentoId;
    private String differentialFocus;
    private String programa;
    private String nivel;

    private Integer avatarId;
    private String role;

    public static UserMeRes of(UserEntity u) {
        return UserMeRes.builder()
                .id(u.getId()).email(u.getEmail()).dni(u.getDni())
                .fullName(u.getFullName()).documentType(u.getDocumentType())
                .genero(u.getGenero()).ageRange(u.getAgeRange())
                .department(u.getDepartment()).municipality(u.getMunicipality()).phone(u.getPhone())
                .fechaNacimiento(u.getFechaNacimiento())
                .emailPersonal(u.getEmailPersonal()).ciudadResidencia(u.getCiudadResidencia())
                .subregion(u.getSubregion()).tipoDocumentoId(u.getTipoDocumentoId())
                .differentialFocus(u.getDifferentialFocus())
                .programa(u.getPrograma()).nivel(u.getNivel())
                .avatarId(u.getAvatarId()).role(u.getRole())
                .build();
    }
}
package com.ui.main.model.dto;

import com.ui.main.repository.entity.UserEntity;

public record UserWithExperienceStatusRes(
        Long id,
        String email,
        String dni,
        String documentType,
        String fullName,
        Boolean enabled,
        int experienceStatus,
        String subregion,
        String genero,
        String ageRange,
        String differentialFocus,
        String nivel,
        String programa,
        String municipality,
        String department,
        String phone,
        Integer riskScore,
        String riskProfile
) {
    public static UserWithExperienceStatusRes of(UserEntity u, int experienceStatus) {
        return new UserWithExperienceStatusRes(
                u.getId(),
                u.getEmail(),
                u.getDni(),
                u.getDocumentType(),
                u.getFullName(),
                u.getEnabled(),
                experienceStatus,
                u.getSubregion(),
                u.getGenero(),
                u.getAgeRange(),
                u.getDifferentialFocus(),
                u.getNivel(),
                u.getPrograma(),
                u.getMunicipality(),
                u.getDepartment(),
                u.getPhone(),
                u.getRiskScore(),
                u.getRiskProfile()
        );
    }
}

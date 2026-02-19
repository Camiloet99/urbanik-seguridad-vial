package com.ui.main.model.dto;

import com.ui.main.repository.entity.UserEntity;

public record UserWithExperienceStatusRes(
        Long id,
        String email,
        String dni,
        String fullName,
        Boolean enabled,
        int experienceStatus,      
        String subregion,
        String genero,
        String ageRange,
        String differentialFocus,
        String nivel,
        String programa,
        String municipio
) {
    public static UserWithExperienceStatusRes of(UserEntity u, int experienceStatus) {
        return new UserWithExperienceStatusRes(
                u.getId(),
                u.getEmail(),
                u.getDni(),
                u.getFullName(),
                u.getEnabled(),
                experienceStatus,
                u.getSubregion(),
                u.getGenero(),
                u.getAgeRange(),
                u.getDifferentialFocus(),
                u.getNivel(),
                u.getPrograma(),
                u.getCiudadResidencia()
        );
    }
}

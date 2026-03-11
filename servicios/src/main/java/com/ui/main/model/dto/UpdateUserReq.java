package com.ui.main.model.dto;

import lombok.Data;

@Data
public class UpdateUserReq {
    private String name;
    private String phone;
    private Integer avatarId;
    private Integer riskScore;
    private String riskProfile;
    private String actorVial;
    private String genero;
    private String ageRange;
    private String differentialFocus;
    private String department;
    private String municipality;
}
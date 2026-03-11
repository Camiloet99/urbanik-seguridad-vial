package com.ui.main.model.dto;

/**
 * Request body for PATCH /progress/me/medals
 * { "numero": 1 }   →  marca medalla 1 como obtenida
 */
public record MedalMarkReq(int numero) {}

package com.ui.main.model.dto;

/**
 * Request body for PATCH /progress/me/quiz.
 *
 * @param modulo  Module number (1–6).
 * @param quiz    Quiz number within the module (1–4).
 * @param done    {@code true} to mark as completed, {@code false} to mark as pending.
 */
public record QuizSubmitReq(int modulo, int quiz, boolean done) {}

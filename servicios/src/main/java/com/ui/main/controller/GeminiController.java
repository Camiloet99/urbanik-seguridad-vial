package com.ui.main.controller;

import com.ui.main.model.dto.GeminiMessageReq;
import com.ui.main.model.dto.GeminiMessageRes;
import com.ui.main.services.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/gemini")
@RequiredArgsConstructor
@Slf4j
public class GeminiController {

    private final GeminiService geminiService;

    @PostMapping
    public Mono<GeminiMessageRes> generateResponse(@RequestBody Mono<GeminiMessageReq> request) {
        if (!geminiService.isConfigured()) {
            return Mono.error(new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Gemini API no está configurada. Por favor, configura la variable de entorno GOOGLE_API_KEY"
            ));
        }

        return request
                .doOnNext(req -> {
                    if (req.getMessage() == null || req.getMessage().trim().isEmpty()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El mensaje no puede estar vacío");
                    }
                    log.info("Mensaje recibido en Gemini: {}", req.getMessage());
                })
                .flatMap(req -> geminiService.generateContent(req.getMessage()))
                .map(response -> GeminiMessageRes.builder()
                        .response(response)
                        .build())
                .onErrorResume(err -> {
                    log.error("Error procesando solicitud de Gemini: {}", err.getMessage(), err);
                    return Mono.error(err);
                });
    }
}


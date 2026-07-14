package com.ui.main.controller;

import com.ui.main.model.dto.ChatMessage;
import com.ui.main.model.dto.GeminiMessageReq;
import com.ui.main.model.dto.GeminiMessageRes;
import com.ui.main.services.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.List;

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
                "La IA no está configurada. Falta AZURE_OPENAI_ENDPOINT / AZURE_OPENAI_KEY."
            ));
        }

        return request
                .flatMap(req -> {
                    List<ChatMessage> msgs = req.getMessages();

                    // Compatibilidad: si mandan un solo mensaje suelto.
                    if (msgs == null || msgs.isEmpty()) {
                        if (req.getMessage() == null || req.getMessage().trim().isEmpty()) {
                            return Mono.<String>error(new ResponseStatusException(
                                    HttpStatus.BAD_REQUEST, "El mensaje no puede estar vacío"));
                        }
                        msgs = List.of(new ChatMessage("user", req.getMessage()));
                    }

                    return geminiService.chat(msgs);
                })
                .map(response -> GeminiMessageRes.builder().response(response).build())
                .onErrorResume(err -> {
                    if (err instanceof ResponseStatusException) return Mono.error(err);
                    log.error("Error procesando solicitud de IA: {}", err.getMessage(), err);
                    return Mono.error(err);
                });
    }
}

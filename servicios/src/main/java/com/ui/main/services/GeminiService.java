package com.ui.main.services;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
@Slf4j
public class GeminiService {

    private final Client client;
    private final boolean isConfigured;

    public GeminiService() {
        Client tempClient = null;
        boolean configured = false;

        try {
            String apiKey = System.getenv("GOOGLE_API_KEY");

            if (apiKey != null && !apiKey.isBlank()) {
                tempClient = new Client();
                configured = true;
                log.info("✓ GeminiService inicializado correctamente");
            } else {
                log.warn("GOOGLE_API_KEY no configurada - El servicio de Gemini estará deshabilitado");
                log.warn("Para habilitar Gemini, configura: $env:GOOGLE_API_KEY = 'tu-api-key'");
            }
        } catch (Exception e) {
            log.warn("Error al inicializar GeminiService (continuando sin Gemini): {}", e.getMessage());
        }

        this.client = tempClient;
        this.isConfigured = configured;
    }

    public boolean isConfigured() {
        return isConfigured;
    }

    public Mono<String> generateContent(String message) {
        if (!isConfigured) {
            return Mono.error(new RuntimeException(
                "Gemini API no está configurada. Por favor, configura la variable de entorno GOOGLE_API_KEY"
            ));
        }

        return Mono.fromCallable(() -> {
            try {
                log.debug("Enviando mensaje a Gemini: {}", message);

                GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.0-flash",
                    message,
                    null
                );

                String result = response.text();
                log.debug("Respuesta recibida de Gemini");

                return result != null && !result.isEmpty() ? result : "No se pudo generar una respuesta.";

            } catch (Exception ex) {
                log.error("Error en la API de Gemini: {}", ex.getMessage(), ex);
                throw new RuntimeException("Error al comunicarse con Gemini: " + ex.getMessage(), ex);
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }
}


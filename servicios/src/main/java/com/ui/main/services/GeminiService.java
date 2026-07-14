package com.ui.main.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.ui.main.model.dto.ChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

/**
 * Proxy hacia Azure OpenAI (chat completions). La API key vive SOLO en el
 * backend como secreto (AZURE_OPENAI_KEY), nunca en el navegador. Antes esto
 * usaba la API de Gemini con la clave incrustada en el frontend, que quedó
 * expuesta y fue suspendida por Google.
 */
@Service
@Slf4j
public class GeminiService {

    private final WebClient client;
    private final String deployment;
    private final String apiVersion;
    private final boolean configured;

    public GeminiService(@Value("${app.openai.endpoint:}") String endpoint,
                         @Value("${app.openai.key:}") String key,
                         @Value("${app.openai.deployment:gpt-4o-mini}") String deployment,
                         @Value("${app.openai.api-version:2024-08-01-preview}") String apiVersion) {
        this.deployment = deployment;
        this.apiVersion = apiVersion;

        if (endpoint != null && !endpoint.isBlank() && key != null && !key.isBlank()) {
            String base = endpoint.endsWith("/") ? endpoint : endpoint + "/";
            this.client = WebClient.builder()
                    .baseUrl(base)
                    .defaultHeader("api-key", key)
                    .build();
            this.configured = true;
            log.info("✓ Azure OpenAI configurado (deployment '{}')", deployment);
        } else {
            this.client = null;
            this.configured = false;
            log.warn("Azure OpenAI no configurado (faltan AZURE_OPENAI_ENDPOINT / AZURE_OPENAI_KEY)");
        }
    }

    public boolean isConfigured() {
        return configured;
    }

    public Mono<String> chat(List<ChatMessage> messages) {
        if (!configured) {
            return Mono.error(new RuntimeException("Azure OpenAI no está configurado."));
        }

        String uri = "openai/deployments/" + deployment + "/chat/completions?api-version=" + apiVersion;

        List<Map<String, String>> payloadMsgs = messages.stream()
                .filter(m -> m != null && m.getRole() != null && m.getContent() != null)
                .map(m -> Map.of("role", m.getRole(), "content", m.getContent()))
                .toList();

        // Solo 'messages': los modelos gpt-5 rechazan temperature custom y
        // max_tokens (usan otros parámetros). Los defaults sirven para el chat.
        Map<String, Object> body = Map.of("messages", payloadMsgs);

        return client.post()
                .uri(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(json -> {
                    JsonNode content = json.path("choices").path(0).path("message").path("content");
                    return content.isMissingNode() || content.asText().isBlank()
                            ? "No se pudo generar una respuesta."
                            : content.asText();
                })
                .onErrorMap(ex -> {
                    log.error("Error en Azure OpenAI: {}", ex.getMessage(), ex);
                    return new RuntimeException("Error al comunicarse con la IA: " + ex.getMessage(), ex);
                });
    }
}

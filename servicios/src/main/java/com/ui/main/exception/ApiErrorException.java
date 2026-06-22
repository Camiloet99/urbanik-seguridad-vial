package com.ui.main.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class ApiErrorException extends ResponseStatusException {

    private final String code;
    private final String field;

    public ApiErrorException(HttpStatus status, String reason, String code, String field) {
        super(status, reason);
        this.code = code;
        this.field = field;
    }

    public String getCode() {
        return code;
    }

    public String getField() {
        return field;
    }
}

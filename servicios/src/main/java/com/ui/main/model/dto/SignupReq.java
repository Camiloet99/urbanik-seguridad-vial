package com.ui.main.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupReq {
    @NotBlank
    private String email;
    
    @NotBlank
    private String documentType;
    
    @NotBlank
    private String dni;
    
    @NotBlank
    private String fullName;
    
    @NotBlank
    private String department;
    
    @NotBlank
    private String municipality;
    
    @NotBlank
    private String phone;
    
    @NotBlank
    private String ageRange;
    
    @NotBlank
    private String gender;
    
    @NotBlank
    private String differentialFocus;
    
    @NotBlank
    @Size(min = 8)
    private String password;
}
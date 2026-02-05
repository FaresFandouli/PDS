package com.pds.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Nom d'utilisateur requis")
    private String username;

    @NotBlank(message = "Mot de passe requis")
    private String password;
}

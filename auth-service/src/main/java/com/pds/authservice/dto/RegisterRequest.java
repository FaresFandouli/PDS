package com.pds.authservice.dto;

import com.pds.authservice.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Nom d'utilisateur requis")
    private String username;

    @NotBlank(message = "Mot de passe requis")
    private String password;

    @NotNull(message = "Rôle requis")
    private UserRole role; // PATIENT, DOCTOR, ADMIN
}

package com.pds.authservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI authServiceAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("🔐 Auth Service API - MedInsight")
                        .description("API de gestion de l'authentification, des utilisateurs et des autorisations")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("MedInsight Team")
                                .email("support@medinsight.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8982")
                                .description("Via Gateway (Recommandé)"),
                        new Server()
                                .url("http://localhost:8082")
                                .description("Direct - Auth Service")
                ))
                .components(new Components()
                        .addSecuritySchemes("bearer-jwt", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Entrez votre token JWT (sans 'Bearer')")))
                .addSecurityItem(new SecurityRequirement().addList("bearer-jwt"));
    }
}

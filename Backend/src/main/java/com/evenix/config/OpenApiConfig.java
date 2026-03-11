package com.evenix.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@Configuration
@OpenAPIDefinition(info = @Info(title ="API Gestion des Evènements", version = "1.0", description = "Documentation de l'API backend"))
public class OpenApiConfig {

}

package com.evenix.controllers;

import com.evenix.dto.*;
import com.evenix.dto.request.RegistrationRequest;
import com.evenix.entities.Utilisateur;
import com.evenix.mappers.UtilisateurMapper;
import com.evenix.services.AuthService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<ApiResponse<UtilisateurDTO>> register(@Valid @RequestBody RegistrationRequest request) {
    try {
      UtilisateurDTO userDTO = authService.register(request);
      ApiResponse<UtilisateurDTO> response = new ApiResponse<>(
          true,
          "Inscription réussie !",
          userDTO
      );
      return ResponseEntity.status(HttpStatus.CREATED).body(response);

    } catch (IllegalArgumentException | jakarta.persistence.EntityNotFoundException e) {
      ApiResponse<UtilisateurDTO> response = new ApiResponse<>(false, e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

    } catch (RuntimeException e) {
      ApiResponse<UtilisateurDTO> response = new ApiResponse<>(false, "Erreur interne");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
  }

  @PostMapping("/login")
  public ResponseEntity<ApiResponse<LoginData>> login(@RequestBody LoginRequest request) {
    try {
      Utilisateur user = authService.login(request);
      String token = authService.generateTokenFor(user);

      LoginData data = new LoginData(token, UtilisateurMapper.fromEntity(user));
      ApiResponse<LoginData> response = new ApiResponse<>(true, "Connexion réussie !", data);
      return ResponseEntity.ok(response);

    } catch (IllegalArgumentException | jakarta.persistence.EntityNotFoundException e) {
      ApiResponse<LoginData> response = new ApiResponse<>(false, e.getMessage());
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);

    } catch (RuntimeException e) {
      ApiResponse<LoginData> response = new ApiResponse<>(false, "Erreur interne");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
  }
}

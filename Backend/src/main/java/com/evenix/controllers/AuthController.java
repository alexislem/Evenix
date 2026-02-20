package com.evenix.controllers;

import com.evenix.dto.*;
import com.evenix.dto.request.RegistrationRequest;
import com.evenix.entities.Utilisateur;
import com.evenix.services.AuthService;
import com.evenix.services.UtilisateurService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;
    
    // On garde aussi le service utilisateur pour les vérifications annexes si besoin
    @Autowired
    private UtilisateurService utilisateurService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UtilisateurDTO>> register(@Valid @RequestBody RegistrationRequest request) {
        try {
            // Note: AuthService.register renvoie maintenant un UtilisateurDTO ou LoginData selon votre implémentation.
            // Ici j'assume qu'il renvoie le DTO de l'utilisateur créé.
            UtilisateurDTO userDTO = authService.register(request);
            
            ApiResponse<UtilisateurDTO> response = new ApiResponse<>(
                true,
                "Inscription réussie !",
                userDTO
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
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
            // AuthService.login renvoie l'entité Utilisateur après vérification du mdp
            Utilisateur user = authService.login(request);
            
            // Génération du Token
            String token = authService.generateTokenFor(user);

            UtilisateurDTO userDto = utilisateurService.getUtilisateurById(user.getId()); 

            LoginData data = new LoginData(token, userDto);
            
            ApiResponse<LoginData> response = new ApiResponse<>(true, "Connexion réussie !", data);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Gestion générique pour mauvais mot de passe ou user introuvable
            ApiResponse<LoginData> response = new ApiResponse<>(false, "Email ou mot de passe incorrect");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}
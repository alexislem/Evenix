package com.evenix.controllers;

import com.evenix.dto.*;
import com.evenix.dto.request.RegistrationRequest;
import com.evenix.dto.request.ResetPasswordRequest;
import com.evenix.entities.Utilisateur;
//import com.evenix.mappers.UtilisateurMapper; // Si vous l'utilisez, sinon mappage manuel
import com.evenix.services.AuthService;
import com.evenix.services.UtilisateurService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

import java.net.URI;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
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
        
        // Si authService.register lance une exception (ex: EmailAlreadyExists),
        // elle remontera directement au GlobalExceptionHandler.
        UtilisateurDTO userDTO = authService.register(request);
        
        ApiResponse<UtilisateurDTO> response = new ApiResponse<>(
            true,
            "Inscription réussie ! Veuillez confirmer votre email.",
            userDTO
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

 // ==========================================
    // LOGIN (Le plus important à corriger)
    // ==========================================
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginData>> login(@RequestBody LoginRequest request) {
        
        // 1. Appel du service
        // Si le mot de passe est faux -> Le service lance une exception
        // Si le compte n'est pas confirmé -> Le service lance une exception avec TON message
        // Comme il n'y a plus de try-catch ici, l'exception remonte au GlobalExceptionHandler !
        Utilisateur user = authService.login(request);
        
        // 2. Si on arrive ici, c'est que tout est OK
        String token = authService.generateTokenFor(user);
        UtilisateurDTO userDto = utilisateurService.getUtilisateurById(user.getId()); 

        LoginData data = new LoginData(token, userDto);
        
        ApiResponse<LoginData> response = new ApiResponse<>(true, "Connexion réussie !", data);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/confirm")
    public ResponseEntity<Void> confirmAccount(@RequestParam("token") String token) {
        // L'URL du frontend
        // Vérifie si c'est localhost:5173 (Vite) 
        String frontendUrl = "http://localhost:5173/login"; 

        try {
            authService.confirmEmail(token);
            
            // Si succès, on redirige vers /login avec un petit paramètre ?confirmed=true
            // Cela permettra d'afficher un message vert sur le front
            URI location = URI.create(frontendUrl + "?confirmed=true");
            
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(location);
            return new ResponseEntity<>(headers, HttpStatus.FOUND);

        } catch (Exception e) {
            // Si erreur (token invalide, déjà confirmé...), on redirige aussi vers login
            // mais avec un paramètre d'erreur
            URI location = URI.create(frontendUrl + "?error=" + e.getMessage());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(location);
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        }
        
        
    }
    
 // ==========================================
    // RÉCUPÉRER LA QUESTION DE SÉCURITÉ
    // ==========================================
    @GetMapping("/security-question")
    public ResponseEntity<Map<String, String>> getSecurityQuestion(@RequestParam("email") String email) {
        // Cette méthode va chercher la question.
        // Si l'email n'existe pas, le service lance EntityNotFoundException -> Géré par GlobalExceptionHandler (404)
        Map<String, String> response = authService.getSecurityQuestion(email);
        return ResponseEntity.ok(response);
    }

    // ==========================================
    // RÉINITIALISER LE MOT DE PASSE
    // ==========================================
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody ResetPasswordRequest request) {
        
        // Appel du service
        // Si la réponse est fausse -> IllegalArgumentException -> Géré par GlobalExceptionHandler (400)
        authService.resetPassword(
            request.getEmail(), 
            request.getReponseSecurite(), 
            request.getNouveauMotDePasse()
        );

        ApiResponse<Void> response = new ApiResponse<>(true, "Mot de passe modifié avec succès !");
        return ResponseEntity.ok(response);
    }
}
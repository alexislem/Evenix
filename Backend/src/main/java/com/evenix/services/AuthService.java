package com.evenix.services;

import com.evenix.dto.UtilisateurDTO;
import com.evenix.dto.request.RegistrationRequest;
import com.evenix.dto.LoginRequest;
import com.evenix.entities.Utilisateur;
import java.util.Map;

public interface AuthService {
    UtilisateurDTO register(RegistrationRequest request);
    Utilisateur login(LoginRequest request);
    String generateTokenFor(Utilisateur utilisateur);
    void confirmEmail(String token);
    
    // --- AJOUTER CES DEUX LIGNES ---
    Map<String, String> getSecurityQuestion(String email);
    void resetPassword(String email, String reponseSecurite, String nouveauMotDePasse);
}
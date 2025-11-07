package com.evenix.services;

import com.evenix.dto.*;
import com.evenix.dto.request.RegistrationRequest;
import com.evenix.entities.Utilisateur;

public interface AuthService {
  UtilisateurDTO register(RegistrationRequest request);
  Utilisateur login(LoginRequest request);
  String generateTokenFor(Utilisateur utilisateur);
}

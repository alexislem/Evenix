package com.evenix.controllers;

import com.evenix.dto.request.RegistrationRequest;
import com.evenix.entities.Utilisateur;
import com.evenix.services.UtilisateurService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
      @Autowired
    private UtilisateurService utilisateurService;

  

    @PostMapping("/register")
    public ResponseEntity<Utilisateur> register(@RequestBody RegistrationRequest request) {
        Utilisateur saved = utilisateurService.registerUtilisateur(request);
        return ResponseEntity
                .created(URI.create("/api/utilisateur/" + saved.getId()))
                .body(saved);
    }
}

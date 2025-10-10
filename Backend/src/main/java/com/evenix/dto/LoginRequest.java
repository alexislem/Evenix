package com.evenix.dto;
/**
• DTO pour la requête de connexion
• Simple: juste email et mot de passe
*/ 
public class LoginRequest {
private String email;
private String motDePasse;

// Constructeur vide
public LoginRequest() {}

// Constructeur avec paramètres
public LoginRequest(String email, String motDePasse) {
 this.email = email;
 this.motDePasse = motDePasse;
}
// Getters et Setters
public String getEmail() {
 return email;
}
public void setEmail(String email) {
 this.email = email;
}
public String getMotDePasse() {
 return motDePasse;
}
public void setMotDePasse(String motDePasse) {
 this.motDePasse = motDePasse;
}
}
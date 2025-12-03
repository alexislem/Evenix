package com.evenix.dto;

public class LoginData {
    private String token;
    private String tokenType = "Bearer";
    
    // J'ai renommé 'user' en 'utilisateur' pour correspondre à vos logs frontend
    // et à la structure attendue par votre code React (response.utilisateur...)
    private UtilisateurDTO utilisateur;

    public LoginData() {}

    public LoginData(String token, UtilisateurDTO utilisateur) {
        this.token = token;
        this.utilisateur = utilisateur;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public UtilisateurDTO getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(UtilisateurDTO utilisateur) {
        this.utilisateur = utilisateur;
    }
}
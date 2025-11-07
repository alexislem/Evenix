package com.evenix.dto;

public class LoginData {
  private String token;
  private String tokenType = "Bearer";
  private UtilisateurDTO user;

  public LoginData() {}

  public LoginData(String token, UtilisateurDTO user) {
    this.token = token;
    this.user = user;
  }

  public String getToken() { return token; }
  public void setToken(String token) { this.token = token; }

  public String getTokenType() { return tokenType; }
  public void setTokenType(String tokenType) { this.tokenType = tokenType; }

  public UtilisateurDTO getUser() { return user; }
  public void setUser(UtilisateurDTO user) { this.user = user; }
}

package com.evenix.dto.request;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class RegistrationRequest {
  private String nom;
  private String prenom;
  private String email;
  private String motDePasse;
  private String telephone;
  private String questionSecurite; // Ex: "Quel est le nom de votre premier animal ?"
  private String reponseSecurite; // Haché via BCrypt
  private LocalDate dateDeNaissance;  // optionnel dans le JSON
  private LocalDateTime dateCreation;
  private Integer roleId;   
  // optionnel, si null → rôle par défaut

  private String role;
  
  public String getNom() { return nom; }
  public void setNom(String nom) { this.nom = nom; }

  public String getPrenom() { return prenom; }
  public void setPrenom(String prenom) { this.prenom = prenom; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getMotDePasse() { return motDePasse; }
  public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }

  public String getTelephone() { return telephone; }
  public void setTelephone(String telephone) { this.telephone = telephone; }

  public LocalDate getDateDeNaissance() { return dateDeNaissance; }
  public void setDateDeNaissance(LocalDate dateDeNaissance) {
    this.dateDeNaissance = dateDeNaissance;
  }

  public Integer getRoleId() { return roleId; }
  public void setRoleId(Integer roleId) { this.roleId = roleId; }
public LocalDateTime getDateCreation() {
	return dateCreation;
}
public void setDateCreation(LocalDateTime dateCreation) {
	this.dateCreation = dateCreation;
}
public String getQuestionSecurite() {
	return questionSecurite;
}
public void setQuestionSecurite(String questionSecurite) {
	this.questionSecurite = questionSecurite;
}
public String getReponseSecurite() {
	return reponseSecurite;
}
public void setReponseSecurite(String reponseSecurite) {
	this.reponseSecurite = reponseSecurite;
}
public String getRole() {
	return role;
}
public void setRole(String role) {
	this.role = role;
}
}

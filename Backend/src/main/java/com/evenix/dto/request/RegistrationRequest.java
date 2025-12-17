package com.evenix.dto.request;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegistrationRequest {
  private String nom;
  private String prenom;
  private String email;

  @NotBlank(message = "Le mot de passe est obligatoire")
  @Size(min = 12, message = "Le mot de passe doit contenir au moins 12 caractères")
  @Pattern(
      regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=[\\]{};':\"\\\\|,.<>/?]).*$",
      message = "Le mot de passe doit contenir au moins une majuscule et un caractère spécial"
  )
  private String motDePasse;

  private String telephone;
  private String questionSecurite; // Ex: "Quel est le nom de votre premier animal ?"
  private String reponseSecurite; // Haché via BCrypt
  private LocalDate dateDeNaissance;  // optionnel dans le JSON
  private LocalDateTime dateCreation;
  private Integer roleId;        // optionnel, si null → rôle par défaut

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

  public LocalDateTime getDateCreation() { return dateCreation; }
  public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

  public String getQuestionSecurite() { return questionSecurite; }
  public void setQuestionSecurite(String questionSecurite) { this.questionSecurite = questionSecurite; }

  public String getReponseSecurite() { return reponseSecurite; }
  public void setReponseSecurite(String reponseSecurite) { this.reponseSecurite = reponseSecurite; }
}

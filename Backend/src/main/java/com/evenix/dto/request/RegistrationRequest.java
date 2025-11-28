package com.evenix.dto.request;

import java.sql.Date;

public class RegistrationRequest {
  private String nom;
  private String prenom;
  private String email;
  private String motDePasse;
  private String telephone;
  private Date dateDeNaissance;  // optionnel dans le JSON
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

  public Date getDateDeNaissance() { return dateDeNaissance; }
  public void setDateDeNaissance(Date dateDeNaissance) {
    this.dateDeNaissance = dateDeNaissance;
  }

  public Integer getRoleId() { return roleId; }
  public void setRoleId(Integer roleId) { this.roleId = roleId; }
}

package com.evenix.dto.request;

import java.sql.Date;

/**
 * DTO d'inscription plus complet (facultatif) :
 * - Si 'username' est fourni, on le mappe vers Utilisateur.nom
 * - Sinon on prend 'nom'
 */
public class RegistrationRequest {
  private String username;      // alias de 'nom'
  private String nom;           // alternatif
  private String prenom;
  private String email;
  private String motDePasse;    // alias de 'password'
  private String password;      // alternatif
  private Date dateDeNaissance;
  private Integer roleId;       // peut être null -> on mettra USER par défaut

  // getters/setters
  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }

  public String getNom() { return nom; }
  public void setNom(String nom) { this.nom = nom; }

  public String getPrenom() { return prenom; }
  public void setPrenom(String prenom) { this.prenom = prenom; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getMotDePasse() { return motDePasse; }
  public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }

  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }

  public Date getDateDeNaissance() { return dateDeNaissance; }
  public void setDateDeNaissance(Date dateDeNaissance) { this.dateDeNaissance = dateDeNaissance; }

  public Integer getRoleId() { return roleId; }
  public void setRoleId(Integer roleId) { this.roleId = roleId; }
}

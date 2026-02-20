package com.evenix.dto;

import java.time.LocalDate;

public class UtilisateurDTO {
    private int id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private LocalDate dateDeNaissance;
    
    private RoleDTO role;
    private EntrepriseDTO entreprise;

    public UtilisateurDTO() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public LocalDate getDateDeNaissance() { return dateDeNaissance; }
    public void setDateDeNaissance(LocalDate dateDeNaissance) { this.dateDeNaissance = dateDeNaissance; }
    public RoleDTO getRole() { return role; }
    public void setRole(RoleDTO role) { this.role = role; }
    public EntrepriseDTO getEntreprise() { return entreprise; }
    public void setEntreprise(EntrepriseDTO entreprise) { this.entreprise = entreprise; }
}
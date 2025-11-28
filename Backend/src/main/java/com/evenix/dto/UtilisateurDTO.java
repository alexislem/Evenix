package com.evenix.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

import java.sql.Date;

import com.evenix.entities.Role;

public class UtilisateurDTO {

    private int id;

    @NotBlank(message = "Le nom est obligatoire.")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire.")
    private String prenom;

    @NotNull(message = "La date de naissance est obligatoire.")
    @Past(message = "La date de naissance doit être dans le passé.")
    private Date dateDeNaissance;

    @NotBlank(message = "L'adresse e-mail est obligatoire.")
    @Email(message = "L'adresse e-mail doit être valide.")
    private String email;
    
    private String telephone;

    private EntrepriseDTO entreprise;

    @NotNull(message = "Le rôle est obligatoire.")
    private Role role;

    // Getters & Setters
    public int getId() {
        return id;
    }
    
    public String getTelephone() {
        return this.telephone;
    }
    
    public void setTelephone(String telephone) {
    	this.telephone = telephone;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public Date getDateDeNaissance() {
        return dateDeNaissance;
    }

    public void setDateDeNaissance(Date dateDeNaissance) {
        this.dateDeNaissance = dateDeNaissance;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public EntrepriseDTO getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(EntrepriseDTO entreprise) {
        this.entreprise = entreprise;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}

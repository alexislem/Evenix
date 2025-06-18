package com.evenix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class RoleDTO {
    
    @Positive(message = "L'identifiant du rôle doit être un entier positif.")
    private int id;

    @NotBlank(message = "Le nom du rôle est obligatoire.")
    private String nom;

    // Getters et Setters
    public int getId() {
        return id;
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
}

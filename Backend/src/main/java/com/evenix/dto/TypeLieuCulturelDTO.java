package com.evenix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class TypeLieuCulturelDTO {

    @Positive(message = "L'identifiant doit être un entier positif.")
    private int id;

    @NotBlank(message = "Le nom du type de lieu culturel est obligatoire.")
    private String nom;

    // Getters & Setters
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

package com.evenix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class TypeLieuDTO {

    @Positive(message = "L'identifiant doit être un entier positif.")
    private int id;

    @NotBlank(message = "Le libellé du type de lieu est obligatoire.")
    private String libelle;

    // Constructeurs
    public TypeLieuDTO() {}

    public TypeLieuDTO(int id, String libelle) {
        this.id = id;
        this.libelle = libelle;
    }

    // Getters & Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }
}

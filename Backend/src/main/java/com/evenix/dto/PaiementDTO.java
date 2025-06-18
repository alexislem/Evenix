package com.evenix.dto;

import java.time.ZonedDateTime;

import jakarta.validation.constraints.*;

public class PaiementDTO {
    
    private int id;

    @Positive(message = "Le montant doit être un nombre positif.")
    private float montant;

    @NotNull(message = "La date du paiement est obligatoire.")
    private ZonedDateTime date;

    @NotBlank(message = "Le code de paiement est obligatoire.")
    private String code;

    @Positive(message = "L'identifiant utilisateur doit être un entier positif.")
    private int utilisateurId;

    @Positive(message = "L'identifiant événement doit être un entier positif.")
    private int evenementId;

    // Getters / Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public float getMontant() {
        return montant;
    }

    public void setMontant(float montant) {
        this.montant = montant;
    }

    public ZonedDateTime getDate() {
        return date;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public int getUtilisateurId() {
        return utilisateurId;
    }

    public void setUtilisateurId(int utilisateurId) {
        this.utilisateurId = utilisateurId;
    }

    public int getEvenementId() {
        return evenementId;
    }

    public void setEvenementId(int evenementId) {
        this.evenementId = evenementId;
    }
}

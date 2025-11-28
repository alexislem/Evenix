package com.evenix.dto;

import jakarta.validation.constraints.*;
import java.time.ZonedDateTime;

public class EvenementDTO {

    private int id;

    @NotBlank(message = "Le nom est obligatoire.")
    @Size(max = 100, message = "Le nom ne peut pas dépasser 100 caractères.")
    private String nom;

    @NotNull(message = "La date de début est obligatoire.")
    private ZonedDateTime dateDebut;

    @NotNull(message = "La date de fin est obligatoire.")
    private ZonedDateTime dateFin;

    @NotNull(message = "Le champ payant est obligatoire.")
    private Boolean payant;

    @Size(max = 500, message = "La description ne peut pas dépasser 500 caractères.")
    private String description;

    @PositiveOrZero(message = "Le prix doit être positif ou nul.")
    private float prix;
    

    @NotNull(message = "Un utilisateur doit être associé à l'évènement.")
    private UtilisateurDTO utilisateur;

    @NotNull(message = "Un lieu doit être associé à l'évènement.")
    private LieuDTO lieu;

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

    public ZonedDateTime getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(ZonedDateTime dateDebut) {
        this.dateDebut = dateDebut;
    }

    public ZonedDateTime getDateFin() {
        return dateFin;
    }

    public void setDateFin(ZonedDateTime dateFin) {
        this.dateFin = dateFin;
    }

    public Boolean getPayant() {
        return payant;
    }

    public void setPayant(Boolean payant) {
        this.payant = payant;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public float getPrix() {
        return prix;
    }

    public void setPrix(float prix) {
        this.prix = prix;
    }

    public UtilisateurDTO getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(UtilisateurDTO utilisateur) {
        this.utilisateur = utilisateur;
    }

    public LieuDTO getLieu() {
        return lieu;
    }

    public void setLieu(LieuDTO lieu) {
        this.lieu = lieu;
    }

}

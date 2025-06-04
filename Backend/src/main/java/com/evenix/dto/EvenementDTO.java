package com.evenix.dto;

import java.time.ZonedDateTime;

public class EvenementDTO {

    private int id;
    private String nom;
    private ZonedDateTime dateDebut;
    private ZonedDateTime dateFin;
    private Boolean payant;
    private String description;
    private float prix;
    private UtilisateurDTO utilisateur;
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
    
    public LieuDTO getLieu () {
    	return lieu;
    }
    
    public void setLieu(LieuDTO lieu) {
    	this.lieu = lieu;
    }

}

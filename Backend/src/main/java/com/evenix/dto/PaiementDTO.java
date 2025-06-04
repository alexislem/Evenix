package com.evenix.dto;

import java.time.ZonedDateTime;

public class PaiementDTO {
	private int id;
    private float montant;
    private ZonedDateTime date;
    private String code;
    private UtilisateurDTO utilisateur;
    private EvenementDTO evenement;
    
//GETTERS/SETTERS
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
    
    public UtilisateurDTO getUtilisateur() {
    	return utilisateur;
    }
    
    public void setUtilisateur(UtilisateurDTO utilisateur) {
    	this.utilisateur = utilisateur;
    }
    
    public EvenementDTO getEvenement() {
    	return evenement;
    }
    
    public void setEvenement(EvenementDTO evenement) {
    	this.evenement = evenement;
    }

}

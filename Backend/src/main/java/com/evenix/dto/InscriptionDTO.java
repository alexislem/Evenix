package com.evenix.dto;

import java.time.ZonedDateTime;

public class InscriptionDTO {
	private int id;
	private ZonedDateTime dateInscription;
    private ZonedDateTime dateAnnulation;
    private UtilisateurDTO utilisateur;
    private EvenementDTO evenement;
    
//GETTERS/SETTERS
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public ZonedDateTime getDateInscription() {
        return dateInscription;
    }

    public void setDateInscription(ZonedDateTime dateInscription) {
        this.dateInscription = dateInscription;
    }

    public ZonedDateTime getDateAnnulation() {
        return dateAnnulation;
    }

    public void setDateAnnulation(ZonedDateTime dateAnnulation) {
        this.dateAnnulation = dateAnnulation;
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

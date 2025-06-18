package com.evenix.entities;

import java.time.ZonedDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Inscription {
	
	// Attributes 
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "INS_Id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "UTI_Id", nullable = false)
    @JsonIgnore
    private Utilisateur utilisateur;

    @ManyToOne
    @JoinColumn(name = "EVE_Id", nullable = false)
    @JsonIgnore
    private Evenement evenement;

    @Column (name = "INS_DateInscription")
    private ZonedDateTime dateInscription;
    
    @Column (name = "INS_DateAnnulation", nullable = true)
    private ZonedDateTime dateAnnulation;
    
    // Constructors
    
    public Inscription() {}
    
    public Inscription (Utilisateur utilisateur, Evenement evenement, ZonedDateTime zdtDateInscription) {
    	this.utilisateur = utilisateur;
    	this.evenement = evenement;
    	this.dateInscription = zdtDateInscription;
    }
    
    // Getters/setters
    public int getId() {
        return id;
    }

	public ZonedDateTime getDateInscription() {
		return this.dateInscription;
	}

	public void setDateInscription(ZonedDateTime zdtDateInscription) {
		this.dateInscription = zdtDateInscription;
	}
	
	public ZonedDateTime getDateAnnulation() {
		return this.dateAnnulation;
	}

	public void setDateAnnulation(ZonedDateTime zdtDateAnnulation) {
		this.dateAnnulation = zdtDateAnnulation;
	}
	
	public Utilisateur getUtilisateur() {
	    return this.utilisateur;
	}

	public Evenement getEvenement() {
	    return this.evenement;
	}

	
	public void setEvenement(Evenement evenement) {
	    this.evenement = evenement;
	}

	public void setUtilisateur(Utilisateur utilisateur) {
	    this.utilisateur = utilisateur;
	}


	// Functions
	
	@Override
	public String toString() {
	    String nomUtilisateur = utilisateur != null ? utilisateur.getNom() : "Inconnu";
	    String nomEvenement = evenement != null ? evenement.getNom() : "Inconnu";

	    return "Inscription de l'utilisateur : " + nomUtilisateur +
	           "; à l'évènement : " + nomEvenement +
	           "; Date d'inscription : " + dateInscription + ";";
	}

	
    
}


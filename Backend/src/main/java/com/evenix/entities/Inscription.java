package com.evenix.entities;

import java.time.ZonedDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Inscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "UTI_Id", nullable = false)
    private Utilisateur utilisateur;

    @ManyToOne
    @JoinColumn(name = "EVE_Id", nullable = false)
    private Evenement evenement;

    private ZonedDateTime dateInscription;
    
    // Getters/setters
    
	public ZonedDateTime getDateInscription() {
		return dateInscription;
	}

	public void setDateInscription(ZonedDateTime dateInscription) {
		this.dateInscription = dateInscription;
	}
	
	public Utilisateur getUtilisateur() {
	    return utilisateur;
	}

	public void setUtilisateur(Utilisateur utilisateur) {
	    this.utilisateur = utilisateur;
	}

	public Evenement getEvenement() {
	    return evenement;
	}

	public void setEvenement(Evenement evenement) {
	    this.evenement = evenement;
	}

	public String toString() {
		try {
			return "Inscription de l'utilisateur : " + this.utilisateur.getNom() + "; Inscription à l'évènement : " + this.evenement.getNom()
			+ "; Date d'inscription : " + this.getDateInscription() + ";";
		}
		catch(Exception e) {
			return "";
		}
	}
	
    
}


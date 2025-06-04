package com.evenix.entities;

import java.time.ZonedDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Paiement {
	
	// Attributes
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column (name = "PAI_Id")
	private int id;
	
	@Column (name = "PAI_Montant")
	private float montant;
	
	@Column (name = "PAI_Date")
	private ZonedDateTime date;
	
	@Column (name = "PAI_Code", unique = false)
	private String code;
	
	@ManyToOne
	@JoinColumn(name = "UTI_Id", nullable = false)
	private Utilisateur utilisateur;
	
	@ManyToOne
	@JoinColumn(name = "EVE_Id", nullable = false)
	private Evenement evenement;
	
	
	// Constructors 
	
	public Paiement () {};
	
	public Paiement (float fMontant, ZonedDateTime zdtDate, String sCode, Utilisateur utilisateur, Evenement evenement) {
		this.montant = fMontant;
		this.date = zdtDate;
		this.code = sCode;
		this.utilisateur = utilisateur;
		this.evenement = evenement;
	}
	
	// Getters/Setters
	
	public int getId() {
	    return this.id;
	}

	public float getMontant() {
		return this.montant;
	}

	public void setMontant(float fMontant) {
		this.montant = fMontant;
	}

	public ZonedDateTime getDate() {
		return this.date;
	}

	public void setDate(ZonedDateTime zdtDate) {
		this.date = zdtDate;
	}

	public String getCode() {
		return this.code;
	}

	public void setCode(String sCode) {
		this.code = sCode;
	}

	public Utilisateur getUtilisateur() {
		return this.utilisateur;
	}

	public void setUtilisateur(Utilisateur utilisateur) {
	    if (this.utilisateur != utilisateur) {
	        this.utilisateur = utilisateur;
	        if (utilisateur != null && !utilisateur.getPaiements().contains(this)) {
	            utilisateur.getPaiements().add(this);
	        }
	    }
	}

	public void setEvenement(Evenement evenement) {
	    if (this.evenement != evenement) {
	        this.evenement = evenement;
	        if (evenement != null && !evenement.getPaiements().contains(this)) {
	            evenement.getPaiements().add(this);
	        }
	    }
	}



	
	public Evenement getEvenement() {
		return this.evenement;
	}

	
	// Functions
	
	@Override
	public String toString() {
	    String nomUtilisateur = (utilisateur != null) ? utilisateur.getNom() : "N/A";
	    String nomEvenement = (evenement != null) ? evenement.getNom() : "N/A";

	    return "Paiement [montant=" + montant +
	           ", date=" + date +
	           ", code=" + code +
	           ", utilisateur=" + nomUtilisateur +
	           ", evenement=" + nomEvenement + "]";
	}
	
}

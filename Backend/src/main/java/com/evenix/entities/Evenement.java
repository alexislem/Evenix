package com.evenix.entities;

import java.time.ZonedDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Evenement {
	
	// Attributes
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int Id;
	
	private String Nom;
	private ZonedDateTime DateDebut;
	private ZonedDateTime DateFin;
	private Boolean Payant;
	private String Description;
	private float Prix;
	
	@ManyToOne
	@JoinColumn(name = "UTI_Id", nullable = false)
	private Utilisateur utilisateur;
	
	@ManyToOne
	@JoinColumn(name = "LIEU_Id", nullable = false)
	private Lieu lieu;
	
	public Evenement(String sNom, ZonedDateTime dtDateDebut, ZonedDateTime dtDateFin, Boolean bPayant, String sDescription, float fPrix, Lieu lieu, Utilisateur utilisateur) {
		this.setNom(sNom);
		this.setDateDebut(dtDateDebut);
		this.setDateFin(dtDateFin);
		this.setPayant(bPayant);
		this.setDescription(sDescription);
		this.setPrix(fPrix);
		this.setLieu(lieu);
		this.setUtilisateur(utilisateur);
	}
	
	public Evenement() {}
	// Getters/Setters
	
	public String getNom() {
		return Nom;
	}

	public void setNom(String sNom) {
		this.Nom = sNom;
	}

	public ZonedDateTime getDateDebut() {
		return DateDebut;
	}

	public void setDateDebut(ZonedDateTime dateDebut) {
		DateDebut = dateDebut;
	}

	public ZonedDateTime getDateFin() {
		return DateFin;
	}

	public void setDateFin(ZonedDateTime dateFin) {
		DateFin = dateFin;
	}

	public Boolean getPayant() {
		return Payant;
	}

	public void setPayant(Boolean payant) {
		Payant = payant;
	}

	public String getDescription() {
		return Description;
	}

	public void setDescription(String description) {
		Description = description;
	}

	public float getPrix() {
		return Prix;
	}

	public void setPrix(float prix) {
		Prix = prix;
	}
	
	public Utilisateur getUtilisateur() {
		return utilisateur;
	}

	public void setUtilisateur(Utilisateur utilisateur) {
		this.utilisateur = utilisateur;
	}

	public Lieu getLieu() {
		return lieu;
	}

	public void setLieu(Lieu lieu) {
		this.lieu = lieu;
	}
	
	// Functions 
	
	public String toString () {
		try {
			return " Nom de l'évènement : " + this.Nom + "; Date de début : " + this.DateDebut+ 
					"; Date de fin :" + this.DateFin +	"; Payant  : " + this.Payant + 
					"; Description :" + this.Description + "; Prix :" + this.Prix + "]";
		}
		catch(Exception e) {
			return "";
		}

	}
}

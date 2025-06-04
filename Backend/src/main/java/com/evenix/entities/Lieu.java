package com.evenix.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Lieu {
	
	// Attributes
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column (name = "LIEU_Id")
	private int id;
	
	@Column (name = "LIEU_Latitude")
	private float latitude;
	
	@Column (name = "LIEU_Longitude")
	private float longitude;
	
	@Column (name = "LIEU_Nom")
	private String nom;
	
	@Column (name = "LIEU_Adresse")
	private String adresse;
	
	// Constructors
	
	public Lieu() {}
	
	public Lieu(float fLatitude, float fLongitude, String sNom, String sAdresse) {
		this.latitude = fLatitude;
		this.longitude = fLongitude;
		this.nom = sNom;
		this.adresse = sAdresse;
	}
	
	// Getters/Setters
	
	public int getId() {
		return this.id;
	}

	public float getLatitude() {
		return this.latitude;
	}

	public void setLatitude(float fLatitude) {
		this.latitude = fLatitude;
	}

	public float getLongitude() {
		return this.longitude;
	}

	public void setLongitude(float fLongitude) {
		this.longitude = fLongitude;
	}

	public String getNom() {
		return this.nom;
	}

	public void setNom(String sNom) {
		this.nom = sNom;
	}

	public String getAdresse() {
		return this.adresse;
	}

	public void setAdresse(String sAdresse) {
		this.adresse = sAdresse;
	}
	
	// Functions
	
	@Override
	public String toString() {
		return "Latitude : " + this.latitude + "; Longitude  : " + this.longitude + 
				"; Nom :" + this.nom + "; Adresse : " + this.adresse + "]";
	}
	
}

package com.evenix.entities;

import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity
public class LieuCulturel {
	
	//Attributes
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int Id;
	
	private String Nom;
	private String Type;
	private float Latitude;
	private float Longitude;
	
	//Constructors
	public LieuCulturel() {}
	
	public LieuCulturel(String sNom, String sType, float Latitude, float Longitude) {
		this.setNom(sNom);
		this.setType(sType);
		this.setLatitude(Latitude);
		this.setLongitude(Longitude);
	}
	
	//Getters/Setters
	public int getId() {
		return this.Id;
	}
	
	public String getNom() {
		return this.Nom;
	}
	public void setNom(String sNom) {
		Nom = sNom;
	}
	public String getType() {
		return this.Type;
	}
	public void setType(String sType) {
		Type = sType;
	}
	public float getLatitude() {
		return this.Latitude;
	}
	public void setLatitude(float fLatitude) {
		Latitude = fLatitude;
	}
	public float getLongitude() {
		return this.Longitude;
	}
	public void setLongitude(float fLongitude) {
		Longitude = fLongitude;
	}
	
	//Functions
	@Override
	public String toString() {
		try {
		return "Lieu culturel [Nom : " + this.Nom + "; Type : " + this.Type + 
				"; Latitude : " + this.Latitude + "; Longitude : " + this.Longitude + "]";
		}
		catch(Exception e) {
			return "";
		}
	}
}

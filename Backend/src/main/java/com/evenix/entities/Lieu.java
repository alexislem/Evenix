package com.evenix.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Lieu {
	
	//Attributes
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int Id;
	
	private float Latitude;
	private float Longitude;
	private String Nom;
	private String Adresse;
	
	//Constructors
	public Lieu() {}
	
	public Lieu(float fLatitude, float fLongitude, String sNom, String sAdresse) {
		this.set_Latitude(fLatitude);
		this.set_Longitude(fLongitude);
		this.set_Nom(sNom);
		this.set_Adresse(sAdresse);
	}
	
	//Getters/Setters
	public int get_Id() {
		return Id;
	}

	public float get_Latitude() {
		return Latitude;
	}

	public void set_Latitude(float fLatitude) {
		this.Latitude = fLatitude;
	}

	public float get_Longitude() {
		return Longitude;
	}

	public void set_Longitude(float fLongitude) {
		this.Longitude = fLongitude;
	}

	public String get_Nom() {
		return Nom;
	}

	public void set_Nom(String sNom) {
		this.Nom = sNom;
	}

	public String get_Adresse() {
		return Adresse;
	}

	public void set_Adresse(String sAdresse) {
		this.Adresse = sAdresse;
	}
	
	//Functions
	
	@Override
	public String toString() {
		try	{
		return "Latitude : " + this.Latitude + "; Longitude  : " + this.Longitude + 
				"; Nom :" + this.Nom + "; Adresse : " + this.Adresse + "]";
		}
		catch(Exception e) {
			return "";
		}
	}
	
}

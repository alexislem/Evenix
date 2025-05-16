package com.evenix.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Entreprise {
	
	//Attributes
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int iId;
	
	private String Nom;
	private String StatutJuridique;
	private String Adresse;
	private String SecteurActivite;
	private String Telephone;
	private String Email;
	
	//Constructor
	public Entreprise() {};
	
	public Entreprise (String sNom, String sStatutJuridique, String sAdresse, String sSecteurActivite, String sTelephone, String sEmail) {
		this.set_Nom(sNom);
		this.set_StatutJuridique(sStatutJuridique);
		this.set_Adresse(sAdresse);
		this.set_SecteurActivite(sSecteurActivite);
		this.set_Telephone(sTelephone);
		this.set_Email(sEmail);
	}
	
	//Getters/Setters
	public String get_Nom() {
		return Nom;
	}

	public void set_Nom(String sNom) {
		this.Nom = sNom;
	}

	public String get_StatutJuridique() {
		return StatutJuridique;
	}

	public void set_StatutJuridique(String sStatutJuridique) {
		this.StatutJuridique = sStatutJuridique;
	}

	public String get_Adresse() {
		return Adresse;
	}

	public void set_Adresse(String sAdresse) {
		this.Adresse = sAdresse;
	}

	public String get_SecteurActivite() {
		return SecteurActivite;
	}

	public void set_SecteurActivite(String sSecteurActivite) {
		this.SecteurActivite = sSecteurActivite;
	}

	public String get_Telephone() {
		return Telephone;
	}

	public void set_Telephone(String sTelephone) {
		this.Telephone = sTelephone;
	}

	public String get_Email() {
		return Email;
	}

	public void set_Email(String sEmail) {
		this.Email = sEmail;
	}
	
	//Functions
	@Override
	public String toString () {
		try {
			return " Nom de l'entreprise : " + this.Nom + "; Statut Juridique : " + this.StatutJuridique + 
					"; Adresse :" + this.Adresse +	"; Secteur d'activité : " + this.SecteurActivite + 
					"; Numéro de téléphone :" + this.Telephone + "; Adresse mail : " + this.Email + "]";
		}
		catch(Exception e) {
			return "";
		}

	}
}

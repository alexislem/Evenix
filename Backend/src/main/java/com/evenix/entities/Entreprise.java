package com.evenix.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Entreprise {
	
	// Attributes
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column (name = "ENT_Id")
	private int id;
	
	@Column (name = "ENT_Nom")
	private String nom;
	
	@Column (name = "ENT_StatutJuridique")
	private String statutJuridique;
	
	@Column (name = "ENT_AdresseSiege")
	private String adresse;
	
	@Column (name = "ENT_SecteurActivite")
	private String secteurActivite;
	
	@Column (name = "ENT_Telephone")
	private String telephone;
	
	@Column (name = "ENT_Email")
	private String email;
	
	@OneToMany(mappedBy = "entreprise")
	private List<Utilisateur> utilisateurs = new ArrayList<>();
	
	// Constructors
	
	public Entreprise() {};
	
	public Entreprise (String sNom, String sStatutJuridique, String sAdresse, String sSecteurActivite, String sTelephone, String sEmail) {
		this.nom = sNom;
		this.statutJuridique = sStatutJuridique;
		this.adresse = sAdresse;
		this.secteurActivite = sSecteurActivite;
		this.telephone = sTelephone;
		this.email = sEmail;
	}
	
	// Getters/Setters
	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	public String getNom() {
		return this.nom;
	}

	public void setNom(String sNom) {
		this.nom = sNom;
	}

	public String getStatutJuridique() {
		return this.statutJuridique;
	}

	public void setStatutJuridique(String sStatutJuridique) {
		this.statutJuridique = sStatutJuridique;
	}

	public String getAdresse() {
		return this.adresse;
	}

	public void setAdresse(String sAdresse) {
		this.adresse = sAdresse;
	}

	public String getSecteurActivite() {
		return this.secteurActivite;
	}

	public void setSecteurActivite(String sSecteurActivite) {
		this.secteurActivite = sSecteurActivite;
	}

	public String getTelephone() {
		return this.telephone;
	}

	public void setTelephone(String sTelephone) {
		this.telephone = sTelephone;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String sEmail) {
		this.email = sEmail;
	}
	
	public List<Utilisateur> getUtilisateurs(){
		return this.utilisateurs;
	}
	
	public void setUtilisateurs(List<Utilisateur> utilisateurs) {
		this.utilisateurs = utilisateurs;
	}
	
	// Functions
	
	@Override
	public String toString () {
			return " Nom de l'entreprise : " + this.nom + "; Statut Juridique : " + this.statutJuridique + 
					"; Adresse :" + this.adresse +	"; Secteur d'activité : " + this.secteurActivite + 
					"; Numéro de téléphone :" + this.telephone + "; Adresse mail : " + this.email + "]";
	}
	
	public void addUtilisateur(Utilisateur utilisateur) {
	    if (this.utilisateurs == null) {
	        this.utilisateurs = new ArrayList<>();
	    }
	    this.utilisateurs.add(utilisateur);
	    utilisateur.setEntreprise(this);
	}

	public void removeUtilisateur(Utilisateur utilisateur) {
	    if (this.utilisateurs != null) {
	        this.utilisateurs.remove(utilisateur);
	        utilisateur.setEntreprise(null);
	    }
	}

	
}

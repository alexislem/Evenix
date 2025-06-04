package com.evenix.dto;

public class EntrepriseDTO {
	private int id;
	private String nom;
	private String statutJuridique;
	private String adresse;
	private String secteurActivite;
	private String telephone;
	private String email;
	
//GETTERS ET SETTERS
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public String getNom() {
		return nom;
	}
	
	public void setNom(String nom) {
		this.nom = nom;
	}
	
	public String getStatutJuridique() {
		return statutJuridique;
	}
	
	public void setStatutJuridique(String statutJuridique) {
		this.statutJuridique = statutJuridique;
	}
	
	public String getAdresse() {
		return adresse;
	}
	
	public void setAdresse(String adresse) {
		this.adresse = adresse;
	}
	
	public String getSecteurActivite() {
		return secteurActivite;
	}
	public void setSecteurActivite(String secteurActivite) {
		this.secteurActivite = secteurActivite;
	}
	
	public String getTelephone() {
		return telephone;
	}
	
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	
	public String getEmail() {
		return email;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}

}

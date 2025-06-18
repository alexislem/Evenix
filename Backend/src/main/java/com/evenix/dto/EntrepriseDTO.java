package com.evenix.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class EntrepriseDTO {

	private int id; // facultatif selon le contexte (ex : non requis en POST)

	@NotBlank(message = "Le nom de l'entreprise est obligatoire")
	@Size(max = 100, message = "Le nom ne doit pas dépasser 100 caractères")
	private String nom;

	@NotBlank(message = "Le statut juridique est obligatoire")
	@Size(max = 50, message = "Le statut juridique ne doit pas dépasser 50 caractères")
	private String statutJuridique;

	@NotBlank(message = "L'adresse est obligatoire")
	@Size(max = 255, message = "L'adresse ne doit pas dépasser 255 caractères")
	private String adresse;

	@NotBlank(message = "Le secteur d'activité est obligatoire")
	@Size(max = 100, message = "Le secteur d'activité ne doit pas dépasser 100 caractères")
	private String secteurActivite;

	@NotBlank(message = "Le numéro de téléphone est obligatoire")
	@Pattern(regexp = "^\\+?[0-9 .-]{6,20}$", message = "Numéro de téléphone invalide")
	private String telephone;

	@NotBlank(message = "L'adresse email est obligatoire")
	@Email(message = "Format d'email invalide")
	private String email;

	// GETTERS / SETTERS

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

package com.evenix.dto;

import java.sql.Date;



public class UtilisateurDTO {
	private int id;
	private String nom;
	private String prenom;
	private Date dateDeNaissance;
	private String email;
	private EntrepriseDTO entreprise;
	private RoleDTO role;
	
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
	
	public void setNom (String nom) {
		this.nom = nom;
	}
	
	public String getPrenom() {
		return prenom;
	}
	
	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}
	
	public Date getDateDeNaissance() {
		return dateDeNaissance;
	}
	
	public void setDateDeNaissance(Date dateDeNaissance) {
		this.dateDeNaissance = dateDeNaissance;
	}
	
	public String getEmail() {
		return email;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	
	public EntrepriseDTO getEntreprise() {
		return entreprise;
	}
	
	public void setEntreprise(EntrepriseDTO entreprise) {
		this.entreprise = entreprise;
	}
	
	public RoleDTO getRole() {
		return role;
	}
	
	public void setRole(RoleDTO role) {
		this.role = role;
	}
	
	

}

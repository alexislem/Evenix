package com.evenix.entities;

import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Role {
	
	// Attributes
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column (name = "ROL_Id")
	private int id;
	
	@Column (name = "ROL_Nom")
	private String nom;
	
	@OneToMany(mappedBy ="role")
	@JsonIgnore
	private List<Utilisateur> utilisateurs = new ArrayList<>();
	
	// Constructors
	
	public Role() {}
	
	public Role (String sNom) {
		this.nom = sNom;
	}
	
	// Getters/Setters
	
	public int getId() {
	    return this.id;
	}
	
	public void setId(int iId) {
		this.id = iId;
	}

	public void setNom(String sNom) {
		this.nom = sNom;
	}
	
	public String getNom() {
		return this.nom;
	}
	
	public List<Utilisateur> getUtilisateurs(){
		return this.utilisateurs;
	}
	
	public void setUtilisateurs(List<Utilisateur> utilisateurs) {
	    this.utilisateurs = utilisateurs;
	}
	
	// Functions
	
	@Override
	public String toString() {
		return "Role [id : " + this.id + "; Nom : " + this.nom + "]";
	}
	
	public void addUtilisateur(Utilisateur utilisateur) {
	    if (utilisateur != null && !this.utilisateurs.contains(utilisateur)) {
	        this.utilisateurs.add(utilisateur);
	        utilisateur.setRole(this);
	    }
	}
	
	public void removeUtilisateur(Utilisateur utilisateur) {
	    if (utilisateur != null && this.utilisateurs.remove(utilisateur)) {
	        utilisateur.setRole(null);
	    }
	}

}

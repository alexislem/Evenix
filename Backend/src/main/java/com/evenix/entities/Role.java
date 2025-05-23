package com.evenix.entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Role {
	
	//Attributes
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int Id;
	
	private String Nom;
	
	@OneToMany(mappedBy ="utilisateur")
	private List<Utilisateur> utilisateurs;
	
	//Constructors
	public Role() {}
	
	public Role (String sNom) {
		this.set_Nom(sNom);
	}
	
	//Getters/Setters
	public void set_Nom(String sNom) {
		this.Nom = sNom;
	}
	
	public String get_Nom() {
		return this.Nom;
	}
	
	public List<Utilisateur> get_Utilisateurs(){
		return utilisateurs;
	}
	//Functions
	
	@Override
	public String toString() {
		try {
		return "Role [id : " + this.Id + "; Nom : " + this.Nom + "]";
		}
				catch(Exception e) {
		return "";
				}
	}
}

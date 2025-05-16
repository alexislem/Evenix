package com.evenix.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Role {
	
	//Attributes
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int Id;
	
	private String Nom;
	
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

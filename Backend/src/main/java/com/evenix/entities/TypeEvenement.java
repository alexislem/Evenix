package com.evenix.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class TypeEvenement {
	//attributes
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int Id;
	private String Nom;
	
	//constructor
	public TypeEvenement () {}
	
	public TypeEvenement (String sNom) {
		this.setNom(sNom);
	}

	
	//GETTERS/SETTERS
	public String getNom() {
		return Nom;
	}

	public void setNom(String nom) {
		Nom = nom;
	}
	
	//ToString
	public String toString () {
		try {
		return "Type d'evenement [Nom : " + this.Nom + "]";
		}
		catch(Exception e) {
			return "";
		}
		
	}
	

}

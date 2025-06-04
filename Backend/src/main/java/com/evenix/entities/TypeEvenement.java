package com.evenix.entities;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

@Entity
public class TypeEvenement {
	
	// Attributes
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column (name = "TYP_EVE_Id")
	private int id;
	
	@Column (name = "TYP_EVE_Nom")
	private String nom;
	
	@ManyToMany(mappedBy ="typesEvenement")
	private Set<Evenement> evenements = new HashSet<>();
	
	// Constructors
	
	public TypeEvenement () {}
	
	public TypeEvenement (String sNom) {
		this.nom = sNom;
	}

	
	// Getters/Setters
	
	public int getId() {
	    return this.id;
	}

	public String getNom() {
		return this.nom;
	}

	public void setNom(String sNom) {
		this.nom = sNom;
	}
	
	public Set<Evenement> getEvenements() {
	    return this.evenements;
	}

	public void setEvenements(Set<Evenement> evenements) {
	    this.evenements = evenements;
	}

	// Functions
	
	@Override
	public String toString () {
		return "Type d'évènement [Nom : " + this.nom + "]";
	}
	
	public void addEvenement(Evenement evenement) {
	    if (evenement != null && !evenements.contains(evenement)) {
	        evenements.add(evenement);
	        evenement.addTypeEvenement(this);
	    }
	}

	
	public void removeEvenement(Evenement evenement) {
	    if (this.evenements != null) {
	        this.evenements.remove(evenement);
	    }
	}
	
}

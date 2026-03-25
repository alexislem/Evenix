package com.evenix.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "favoris")
public class Favoris {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
	
	@ManyToOne
    @JoinColumn(name = "evenement_id")
    private Evenement evenement;
	
	@ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;
	
	private LocalDateTime dateAjout = LocalDateTime.now();
	
	//constructor
	public Favoris () {
	}
	
	//Getters et Setters
	public int getId() {
		return id; 
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public Evenement getEvenement() {
		return evenement;
	}
	
	public void setEvenement (Evenement evenement) {
		this.evenement = evenement;
	}
	
	public Utilisateur getUtilisateur() {
		return utilisateur;
	}
	
	public void setUtilisateur (Utilisateur utilisateur) {
		this.utilisateur = utilisateur;
	}

	public LocalDateTime getDateAjout() {
		return dateAjout;
	}

	public void setDateAjout(LocalDateTime dateAjout) {
		this.dateAjout = dateAjout;
	}
	
	

}

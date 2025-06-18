package com.evenix.entities;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class LieuCulturel {
	
	// Attributes
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column (name = "LIEU_CULTU_Id")
	private int id;
	
	@Column (name = "LIEU_CULTU_Nom")
	private String nom;
	
	@Column (name = "LIEU_CULTU_Latitude")
	private float latitude;
	
	@Column (name = "LIEU_CULTU_Longitude")
	private float longitude;
	
	@ManyToMany(mappedBy = "lieuxCulturelsProches")
	private Set<Evenement> evenementsProches = new HashSet <>();
	
	@ManyToOne
	@JoinColumn(name = "TYP_LIEU_ID", nullable = false)
	private TypeLieuCulturel typeLieuCulturel;
	
	// Constructors
	
	public LieuCulturel() {}
	
	public LieuCulturel(String sNom, float fLatitude, float fLongitude, TypeLieuCulturel type) {
	    this.nom = sNom;
	    this.latitude = fLatitude;
	    this.longitude = fLongitude;
	    this.typeLieuCulturel = type;
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
	

	public float getLatitude() {
		return this.latitude;
	}
	
	public void setLatitude(float fLatitude) {
		this.latitude = fLatitude;
	}
	
	public float getLongitude() {
		return this.longitude;
	}
	
	public TypeLieuCulturel getTypeLieuCulturel() {
	    return typeLieuCulturel;
	}

	public void setTypeLieuCulturel(TypeLieuCulturel typeLieuCulturel) {
	    this.typeLieuCulturel = typeLieuCulturel;
	}

	
	public void setLongitude(float fLongitude) {
		this.longitude = fLongitude;
	}
	
	public Set<Evenement> getEvenementsProches() {
	    return this.evenementsProches;
	}

	
	// Functions
	
	@Override
	public String toString() {
	    String typeNom = (typeLieuCulturel != null) ? typeLieuCulturel.getNom() : "Inconnu";
	    return "Lieu culturel [Nom : " + this.nom +
	           "; Type : " + typeNom +
	           "; Latitude : " + this.latitude +
	           "; Longitude : " + this.longitude + "]";
	}




}

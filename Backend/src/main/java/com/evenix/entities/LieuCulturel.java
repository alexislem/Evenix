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
public class LieuCulturel {
	
	// Attributes
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column (name = "LIEU_CULTU_Id")
	private int id;
	
	@Column (name = "LIEU_CULTU_Nom")
	private String nom;
	
	@Column (name = "LIEU_CULTU_Type")
	private String type;
	
	@Column (name = "LIEU_CULTU_Latitude")
	private float latitude;
	
	@Column (name = "LIEU_CULTU_Longitude")
	private float longitude;
	
	@ManyToMany(mappedBy = "lieuxCulturelsProches")
	private Set<Evenement> evenementsProches = new HashSet <>();
	
	// Constructors
	
	public LieuCulturel() {}
	
	public LieuCulturel(String sNom, String sType, float fLatitude, float fLongitude) {
		this.nom = sNom;
		this.type = sType;
		this.latitude = fLatitude;
		this.longitude = fLongitude;
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
	
	public String getType() {
		return this.type;
	}
	
	public void setType(String sType) {
		this.type = sType;
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
	
	public void setLongitude(float fLongitude) {
		this.longitude = fLongitude;
	}
	
	public Set<Evenement> getEvenementsProches() {
	    return this.evenementsProches;
	}

	
	// Functions
	
	@Override
	public String toString() {
		return "Lieu culturel [Nom : " + this.nom + "; Type : " + this.type + 
				"; Latitude : " + this.latitude + "; Longitude : " + this.longitude + "]";
	}
	
	public void addEvenement(Evenement evenement) {
	    if (evenement != null && !evenementsProches.contains(evenement)) {
	        evenementsProches.add(evenement);
	        evenement.addLieuCulturelProche(this);
	    }
	}
	
	public void removeEvenement(Evenement evenement) {
	    if (evenement != null && evenementsProches.remove(evenement)) {
	        evenement.getLieuxCulturelsProches().remove(this);
	    }
	}


}

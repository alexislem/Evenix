package com.evenix.dto;

public class LieuDTO {
	    private int id;
	    private float latitude;
	    private float longitude;
	    private String nom;
	    private String adresse;
	    
//GETTERS/SETTERS
	    public int getId() {
	        return id;
	    }

	    public void setId(int id) {
	        this.id = id;
	    }

	    public float getLatitude() {
	        return latitude;
	    }

	    public void setLatitude(float latitude) {
	        this.latitude = latitude;
	    }

	    public float getLongitude() {
	        return longitude;
	    }

	    public void setLongitude(float longitude) {
	        this.longitude = longitude;
	    }

	    public String getNom() {
	        return nom;
	    }

	    public void setNom(String nom) {
	        this.nom = nom;
	    }

	    public String getAdresse() {
	        return adresse;
	    }

	    public void setAdresse(String adresse) {
	        this.adresse = adresse;
	    }
	}




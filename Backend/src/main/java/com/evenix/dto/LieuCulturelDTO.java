package com.evenix.dto;

public class LieuCulturelDTO {
	private int id;
    private String nom;
    private TypeLieuCulturelDTO typeLieuCulturel;
    private float latitude;
    private float longitude;

// Getters & Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
    
    public TypeLieuCulturelDTO getTypeLieuCulturel() {
        return typeLieuCulturel;
    }

    public void setTypeLieuCulturel(TypeLieuCulturelDTO typeLieuCulturel) {
        this.typeLieuCulturel = typeLieuCulturel;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
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
}



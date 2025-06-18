package com.evenix.dto;

public class LieuDTO {

    private int id;
    private float latitude;
    private float longitude;
    private String nom;
    private String adresse;
    private int nbPlaces;

    private TypeLieuDTO typeLieu;
    
    // Constructor

    public LieuDTO() {}
    
    // Getters / Setters

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

    public int getNbPlaces() {
        return nbPlaces;
    }

    public void setNbPlaces(int nbPlaces) {
        this.nbPlaces = nbPlaces;
    }

    public TypeLieuDTO getTypeLieu() {
        return typeLieu;
    }

    public void setTypeLieu(TypeLieuDTO typeLieu) {
        this.typeLieu = typeLieu;
    }
}

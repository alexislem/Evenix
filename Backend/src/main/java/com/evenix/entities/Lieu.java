package com.evenix.entities;

import jakarta.persistence.*;

@Entity
public class Lieu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LIEU_Id")
    private int id;

    @Column(name = "LIEU_Latitude")
    private float latitude;

    @Column(name = "LIEU_Longitude")
    private float longitude;

    @Column(name = "LIEU_Nom")
    private String nom;

    @Column(name = "LIEU_Adresse")
    private String adresse;

    @Column(name = "LIEU_NbPlaces")
    private int nbplaces;

    @ManyToOne
    @JoinColumn(name = "TYP_Id", nullable = false)
    private TypeLieu typeLieu;

    // Constructors

    public Lieu() {}

    public Lieu(float latitude, float longitude, String nom, String adresse, int nb_places, TypeLieu typeLieu) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.nom = nom;
        this.adresse = adresse;
        this.nbplaces = nb_places;
        this.typeLieu = typeLieu;
    }

    // Getters/Setters

    public int getId() {
        return id;
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
        return nbplaces;
    }

    public void setNbPlaces(int nb_places) {
        this.nbplaces = nb_places;
    }

    public TypeLieu getTypeLieu() {
        return typeLieu;
    }

    public void setTypeLieu(TypeLieu typeLieu) {
        this.typeLieu = typeLieu;
    }

    // toString
    @Override
    public String toString() {
        return "Lieu [latitude=" + latitude + ", longitude=" + longitude + ", nom=" + nom +
               ", adresse=" + adresse + ", nb_places=" + nbplaces +
               ", typeLieu=" + (typeLieu != null ? typeLieu.getLibelle() : "null") + "]";
    }
}

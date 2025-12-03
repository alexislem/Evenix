package com.evenix.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "lieu")
public class Lieu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "adresse")
    private String adresse; // Adresse formatée complète (Google formatted_address)

    @Column(name = "ville")
    private String ville;   // Extrait des address_components (locality)

    @Column(name = "code_postal")
    private String codePostal;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "type_lieu") // Ex: "restaurant", "museum", "stadium" (Google types[0])
    private String typeLieu;

    // L'ID unique de Google Places. C'est la clé pour éviter les doublons.
    @Column(name = "google_place_id", unique = true)
    private String googlePlaceId;

    @Column(name = "capacite_max")
    private int capaciteMax; // Ce champ reste manuel (Google ne le donne pas)

    public Lieu() {}

    // Getters et Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    
    public String getCodePostal() { return codePostal; }
    public void setCodePostal(String codePostal) { this.codePostal = codePostal; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    
    public String getTypeLieu() { return typeLieu; }
    public void setTypeLieu(String typeLieu) { this.typeLieu = typeLieu; }
    
    public String getGooglePlaceId() { return googlePlaceId; }
    public void setGooglePlaceId(String googlePlaceId) { this.googlePlaceId = googlePlaceId; }
    
    public int getCapaciteMax() { return capaciteMax; }
    public void setCapaciteMax(int capaciteMax) { this.capaciteMax = capaciteMax; }
}
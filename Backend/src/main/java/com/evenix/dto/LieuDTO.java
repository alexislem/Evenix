package com.evenix.dto;

import jakarta.validation.constraints.*;

public class LieuDTO {

    private int id;

    @DecimalMin(value = "-90.0", message = "La latitude doit être ≥ -90.")
    @DecimalMax(value = "90.0", message = "La latitude doit être ≤ 90.")
    private float latitude;

    @DecimalMin(value = "-180.0", message = "La longitude doit être ≥ -180.")
    @DecimalMax(value = "180.0", message = "La longitude doit être ≤ 180.")
    private float longitude;

    @NotBlank(message = "Le nom du lieu est obligatoire.")
    private String nom;

    @NotBlank(message = "L'adresse du lieu est obligatoire.")
    private String adresse;

    @Min(value = 1, message = "Le nombre de places doit être supérieur à 0.")
    private int nbPlaces;

    @NotNull(message = "Le type de lieu est obligatoire.")
    private TypeLieuDTO typeLieu;
    
    private String ville;

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

	public String getVille() {
		return ville;
	}

	public void setVille(String ville) {
		this.ville = ville;
	}
}

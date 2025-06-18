package com.evenix.dto;

import jakarta.validation.constraints.*;

public class LieuCulturelDTO {

    private int id;

    @NotBlank(message = "Le nom du lieu culturel est obligatoire.")
    private String nom;

    @NotNull(message = "Le type de lieu culturel est obligatoire.")
    private TypeLieuCulturelDTO typeLieuCulturel;

    @DecimalMin(value = "-90.0", message = "La latitude doit être supérieure ou égale à -90.")
    @DecimalMax(value = "90.0", message = "La latitude doit être inférieure ou égale à 90.")
    private float latitude;

    @DecimalMin(value = "-180.0", message = "La longitude doit être supérieure ou égale à -180.")
    @DecimalMax(value = "180.0", message = "La longitude doit être inférieure ou égale à 180.")
    private float longitude;

    // Getters & Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public TypeLieuCulturelDTO getTypeLieuCulturel() {
        return typeLieuCulturel;
    }

    public void setTypeLieuCulturel(TypeLieuCulturelDTO typeLieuCulturel) {
        this.typeLieuCulturel = typeLieuCulturel;
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

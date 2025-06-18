package com.evenix.entities;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class TypeLieu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TYP_Id")
    private int id;

    @Column(name = "TYP_Libelle", nullable = false, unique = true)
    private String libelle;


    // Constructeurs
    public TypeLieu() {}

    public TypeLieu(String libelle) {
        this.libelle = libelle;
    }

    // Getters & Setters
    public int getId() {
        return id;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    // toString
    @Override
    public String toString() {
        return "TypeLieu [id=" + id + ", libelle=" + libelle + "]";
    }
}

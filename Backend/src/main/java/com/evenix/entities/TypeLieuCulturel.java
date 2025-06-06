package com.evenix.entities;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;

@Entity
public class TypeLieuCulturel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TYP_LIEU_ID")
    private int id;

    @Column(name = "TYP_LIEU_NOM")
    private String nom;

    @OneToMany(mappedBy = "typeLieuCulturel")
    private Set<LieuCulturel> lieuxCulturels = new HashSet<>();

    // Constructors
    public TypeLieuCulturel() {}

    public TypeLieuCulturel(String nom) {
        this.nom = nom;
    }

    // Getters & Setters
    public int getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Set<LieuCulturel> getLieuxCulturels() {
        return lieuxCulturels;
    }

    public void setLieuxCulturels(Set<LieuCulturel> lieuxCulturels) {
        this.lieuxCulturels = lieuxCulturels;
    }
}

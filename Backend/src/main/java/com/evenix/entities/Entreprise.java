package com.evenix.entities;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "entreprise")
public class Entreprise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "adresse")
    private String adresse;

    @Column(name = "email")
    private String email;

    @OneToMany(mappedBy = "entreprise")
    @JsonIgnore // Pour éviter de charger tous les utilisateurs quand on charge l'entreprise
    private List<Utilisateur> utilisateurs;

    public Entreprise() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public List<Utilisateur> getUtilisateurs() { return utilisateurs; }
    public void setUtilisateurs(List<Utilisateur> utilisateurs) { this.utilisateurs = utilisateurs; }
}
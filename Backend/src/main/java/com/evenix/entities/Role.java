package com.evenix.entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rol_id")
    private int id;

    @Column(name = "rol_nom")
    private String nom;

    @OneToMany(mappedBy = "role")
    @JsonIgnore
    private List<Utilisateur> utilisateurs = new ArrayList<>();

    // Constructeurs
    public Role() {}

    public Role(String nom) {
        this.nom = nom;
    }

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

    public List<Utilisateur> getUtilisateurs() {
        return utilisateurs;
    }

    public void setUtilisateurs(List<Utilisateur> utilisateurs) {
        this.utilisateurs = utilisateurs;
    }

    // Fonctions
    @Override
    public String toString() {
        return "Role [id=" + id + ", nom=" + nom + "]";
    }

    public void addUtilisateur(Utilisateur utilisateur) {
        if (utilisateur != null && !utilisateurs.contains(utilisateur)) {
            utilisateurs.add(utilisateur);
            utilisateur.setRole(this);
        }
    }

    public void removeUtilisateur(Utilisateur utilisateur) {
        if (utilisateur != null && utilisateurs.remove(utilisateur)) {
            utilisateur.setRole(null);
        }
    }
}

package com.evenix.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "evenement")
public class Evenement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "date_debut", nullable = false)
    private LocalDateTime dateDebut;

    @Column(name = "date_fin")
    private LocalDateTime dateFin;
    
    @Column(name = "prix")
    private double prix;

    // ✅ NOUVEAU CHAMP
    @Column(name = "image_url", length = 500) // length 500 pour les URL longues
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "organisateur_id", nullable = false)
    @JsonIgnoreProperties({"motDePasse", "inscriptions", "entreprise", "role"})
    private Utilisateur utilisateur;

    @ManyToOne
    @JoinColumn(name = "lieu_id")
    private Lieu lieu;
    
    @OneToMany(mappedBy = "evenement")
    @JsonIgnoreProperties("evenement")
    private List<Inscription> inscriptions;

    @ManyToMany
    @JoinTable(
        name = "evenement_type_assoc",
        joinColumns = @JoinColumn(name = "evenement_id"),
        inverseJoinColumns = @JoinColumn(name = "type_id")
    )
    private Set<TypeEvenement> typesEvenement = new HashSet<>();

    public Evenement() {}

    // Getters et Setters existants...
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDateTime dateDebut) { this.dateDebut = dateDebut; }
    public LocalDateTime getDateFin() { return dateFin; }
    public void setDateFin(LocalDateTime dateFin) { this.dateFin = dateFin; }
    public double getPrix() { return prix; }
    public void setPrix(double prix) { this.prix = prix; }
    
    // ✅ Getters/Setters pour imageUrl
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Utilisateur getUtilisateur() { return utilisateur; }
    public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }
    public Lieu getLieu() { return lieu; }
    public void setLieu(Lieu lieu) { this.lieu = lieu; }
    public List<Inscription> getInscriptions() { return inscriptions; }
    public void setInscriptions(List<Inscription> inscriptions) { this.inscriptions = inscriptions; }
    public Set<TypeEvenement> getTypesEvenement() { return typesEvenement; }
    public void setTypesEvenement(Set<TypeEvenement> typesEvenement) { this.typesEvenement = typesEvenement; }
}
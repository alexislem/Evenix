package com.evenix.entities;

import java.time.ZonedDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@JsonIgnoreProperties({"utilisateur", "evenement"}) // empêche les boucles avec Jackson
public class Paiement {

    // Attributs
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAI_Id")
    private int id;

    @Column(name = "PAI_Montant")
    private float montant;

    @Column(name = "PAI_Date")
    private ZonedDateTime date;

    @Column(name = "PAI_Code")
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UTI_Id", nullable = false)
    private Utilisateur utilisateur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EVE_Id", nullable = false)
    private Evenement evenement;

    // Constructeurs

    public Paiement() {}

    public Paiement(float montant, ZonedDateTime date, String code, Utilisateur utilisateur, Evenement evenement) {
        this.montant = montant;
        this.date = date;
        this.code = code;
        this.utilisateur = utilisateur;
        this.evenement = evenement;
    }

    // Getters/Setters

    public int getId() {
        return id;
    }

    public float getMontant() {
        return montant;
    }

    public void setMontant(float montant) {
        this.montant = montant;
    }

    public ZonedDateTime getDate() {
        return date;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public Evenement getEvenement() {
        return evenement;
    }

    public void setEvenement(Evenement evenement) {
        this.evenement = evenement;
    }

    // Méthode utilitaire

    @Override
    public String toString() {
        String nomUtilisateur = (utilisateur != null) ? utilisateur.getNom() : "N/A";
        String nomEvenement = (evenement != null) ? evenement.getNom() : "N/A";

        return "Paiement [montant=" + montant +
               ", date=" + date +
               ", code=" + code +
               ", utilisateur=" + nomUtilisateur +
               ", evenement=" + nomEvenement + "]";
    }
}

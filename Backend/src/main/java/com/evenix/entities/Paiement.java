package com.evenix.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "paiement")
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "montant", nullable = false)
    private double montant;

    @Column(name = "date_paiement", nullable = false)
    private LocalDateTime datePaiement;

    @Column(name = "moyen_paiement") // EX: CARTE, PAYPAL, VIREMENT
    private String moyenPaiement;

    @Column(name = "statut") // EX: SUCCES, ECHEC, REMBOURSE
    private String statut;

    // Relations
    @OneToOne
    @JoinColumn(name = "inscription_id", nullable = false, unique = true)
    private Inscription inscription;

    public Paiement() {
        this.datePaiement = LocalDateTime.now();
    }

    public Paiement(double montant, String moyenPaiement, String statut, Inscription inscription) {
        this.montant = montant;
        this.moyenPaiement = moyenPaiement;
        this.statut = statut;
        this.inscription = inscription;
        this.datePaiement = LocalDateTime.now();
    }

    // Getters et Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getMontant() {
        return montant;
    }

    public void setMontant(double montant) {
        this.montant = montant;
    }

    public LocalDateTime getDatePaiement() {
        return datePaiement;
    }

    public void setDatePaiement(LocalDateTime datePaiement) {
        this.datePaiement = datePaiement;
    }

    public String getMoyenPaiement() {
        return moyenPaiement;
    }

    public void setMoyenPaiement(String moyenPaiement) {
        this.moyenPaiement = moyenPaiement;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public Inscription getInscription() {
        return inscription;
    }

    public void setInscription(Inscription inscription) {
        this.inscription = inscription;
    }
}
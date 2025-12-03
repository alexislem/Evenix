package com.evenix.dto;

import java.time.LocalDateTime;

public class PaiementDTO {
    private int id;
    private double montant;
    private LocalDateTime datePaiement;
    private String moyenPaiement;
    private String statut;
    private int inscriptionId; // On garde juste l'ID pour éviter les boucles infinies

    public PaiementDTO() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public double getMontant() { return montant; }
    public void setMontant(double montant) { this.montant = montant; }
    public LocalDateTime getDatePaiement() { return datePaiement; }
    public void setDatePaiement(LocalDateTime datePaiement) { this.datePaiement = datePaiement; }
    public String getMoyenPaiement() { return moyenPaiement; }
    public void setMoyenPaiement(String moyenPaiement) { this.moyenPaiement = moyenPaiement; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public int getInscriptionId() { return inscriptionId; }
    public void setInscriptionId(int inscriptionId) { this.inscriptionId = inscriptionId; }
}
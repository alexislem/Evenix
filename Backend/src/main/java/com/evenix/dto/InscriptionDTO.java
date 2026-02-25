package com.evenix.dto;

import java.time.LocalDateTime;

public class InscriptionDTO {
    private int id;
    private LocalDateTime dateInscription;
    private String statut;
    
    private UtilisateurDTO utilisateur;
    private EvenementDTO evenement;
    private PaiementDTO paiement;

    public InscriptionDTO() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public LocalDateTime getDateInscription() { return dateInscription; }
    public void setDateInscription(LocalDateTime dateInscription) { this.dateInscription = dateInscription; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public UtilisateurDTO getUtilisateur() { return utilisateur; }
    public void setUtilisateur(UtilisateurDTO utilisateur) { this.utilisateur = utilisateur; }
    public EvenementDTO getEvenement() { return evenement; }
    public void setEvenement(EvenementDTO evenement) { this.evenement = evenement; }
    public PaiementDTO getPaiement() { return paiement; }
    public void setPaiement(PaiementDTO paiement) { this.paiement = paiement; }
}
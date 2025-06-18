package com.evenix.dto;

import jakarta.validation.constraints.NotNull;
import java.time.ZonedDateTime;

public class InscriptionDTO {

    private int id;

    @NotNull(message = "La date d'inscription est obligatoire.")
    private ZonedDateTime dateInscription;

    // La date d'annulation peut être null (par défaut), donc pas d'annotation ici.
    private ZonedDateTime dateAnnulation;

    @NotNull(message = "Un utilisateur est requis pour l'inscription.")
    private UtilisateurDTO utilisateur;

    @NotNull(message = "Un évènement est requis pour l'inscription.")
    private EvenementDTO evenement;

    // GETTERS & SETTERS

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public ZonedDateTime getDateInscription() {
        return dateInscription;
    }

    public void setDateInscription(ZonedDateTime dateInscription) {
        this.dateInscription = dateInscription;
    }

    public ZonedDateTime getDateAnnulation() {
        return dateAnnulation;
    }

    public void setDateAnnulation(ZonedDateTime dateAnnulation) {
        this.dateAnnulation = dateAnnulation;
    }

    public UtilisateurDTO getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(UtilisateurDTO utilisateur) {
        this.utilisateur = utilisateur;
    }

    public EvenementDTO getEvenement() {
        return evenement;
    }

    public void setEvenement(EvenementDTO evenement) {
        this.evenement = evenement;
    }
}

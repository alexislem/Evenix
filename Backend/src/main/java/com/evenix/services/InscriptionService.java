package com.evenix.services;

import com.evenix.entities.Inscription;

import java.time.ZonedDateTime;

public interface InscriptionService {
    Inscription createInscription(int utilisateurId, int evenementId, ZonedDateTime dateInscription);
}

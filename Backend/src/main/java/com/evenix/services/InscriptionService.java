package com.evenix.services;

import java.time.ZonedDateTime;
import java.util.List;
import com.evenix.entities.Inscription;

public interface InscriptionService {
    Inscription createInscription(int utilisateurId, int evenementId, ZonedDateTime dateInscription);
    
    // Le service doit promettre de renvoyer une Liste
    List<Inscription> getInscriptionsByUtilisateurId(int utilisateurId);
    
    void deleteInscription(int inscriptionId);
}
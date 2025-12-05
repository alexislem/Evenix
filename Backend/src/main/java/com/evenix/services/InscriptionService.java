package com.evenix.services;

import com.evenix.dto.InscriptionDTO;
import java.util.List;

public interface InscriptionService {
    InscriptionDTO inscrireUtilisateur(int utilisateurId, int evenementId);
    void annulerInscription(int inscriptionId);
    List<InscriptionDTO> getInscriptionsByUtilisateur(int utilisateurId);
    List<InscriptionDTO> getInscriptionsByEvenement(int evenementId);
}
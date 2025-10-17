package com.evenix.services;

import com.evenix.dto.PaiementDTO;
import com.evenix.entities.Paiement;

import java.util.List;
import java.util.Optional;

public interface PaiementService {
    List<Paiement> getAllPaiements();
    Optional<Paiement> getPaiementById(int id);
    Paiement createPaiement(PaiementDTO dto);
    void deletePaiement(int id);
}

package com.evenix.services;

import com.evenix.dto.PaiementDTO;
import java.util.List;

public interface PaiementService {
    PaiementDTO traiterPaiement(PaiementDTO paiementDTO);
    PaiementDTO getPaiementById(int id);
    List<PaiementDTO> getAllPaiements();
}
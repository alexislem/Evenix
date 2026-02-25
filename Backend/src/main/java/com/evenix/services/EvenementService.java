package com.evenix.services;

import com.evenix.dto.EvenementDTO;
import java.util.List;

public interface EvenementService {
    List<EvenementDTO> getAllEvenements();
    EvenementDTO getEvenementById(int id);
    EvenementDTO createEvenement(EvenementDTO evenementDTO, int organisateurId);
    EvenementDTO updateEvenement(int id, EvenementDTO evenementDTO);
    void deleteEvenement(int id);
    List<EvenementDTO> getEvenementsByOrganisateur(int organisateurId);
}
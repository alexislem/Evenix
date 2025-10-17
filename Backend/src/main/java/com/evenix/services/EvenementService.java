package com.evenix.services;

import com.evenix.dto.EvenementDTO;

import java.util.List;
import java.util.Optional;

public interface EvenementService {
    List<EvenementDTO> getAllEvenements();
    Optional<EvenementDTO> getEvenementById(int id);
    EvenementDTO createEvenement(EvenementDTO dto);
    EvenementDTO updateEvenement(int id, EvenementDTO dto);
    void deleteEvenement(int id);
    List<EvenementDTO> getRecommended(int limit);
}

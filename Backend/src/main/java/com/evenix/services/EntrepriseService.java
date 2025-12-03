package com.evenix.services;

import com.evenix.dto.EntrepriseDTO;
import com.evenix.entities.Entreprise;

import java.util.List;
import java.util.Optional;

public interface EntrepriseService {
    List<EntrepriseDTO> getAllEntreprises();

    Optional<Entreprise> getEntrepriseById(int id);

    Entreprise createEntreprise(Entreprise entreprise);

    Entreprise updateEntreprise(int id, Entreprise updatedEntreprise);

    void deleteEntreprise(int id);
}

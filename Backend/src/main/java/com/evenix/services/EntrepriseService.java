package com.evenix.services;

import com.evenix.dto.EntrepriseDTO;
import java.util.List;

public interface EntrepriseService {
    List<EntrepriseDTO> getAllEntreprises();
    EntrepriseDTO getEntrepriseById(int id);
    EntrepriseDTO createEntreprise(EntrepriseDTO entrepriseDTO);
    void deleteEntreprise(int id);
}
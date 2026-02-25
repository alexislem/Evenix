package com.evenix.services;

import com.evenix.dto.LieuDTO;
import com.evenix.entities.Lieu; // Import nécessaire pour le type de retour
import java.util.List;

public interface LieuService {
    List<LieuDTO> getAllLieux();
    LieuDTO getLieuById(int id);
    LieuDTO createLieu(LieuDTO lieuDTO);
    LieuDTO updateLieu(int id, LieuDTO lieuDTO);
    void deleteLieu(int id);

    // Méthode interne pour récupérer l'entité brute (utilisée par EvenementService)
    Lieu getLieuEntityById(int id);
}
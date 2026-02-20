package com.evenix.services;

import com.evenix.dto.UtilisateurDTO;
import java.util.List;
import java.util.Optional;

public interface UtilisateurService {
    List<UtilisateurDTO> getAllUtilisateurs();
    UtilisateurDTO getUtilisateurById(int id);
    UtilisateurDTO getUtilisateurByEmail(String email);
    
    // Création (Inscription)
    UtilisateurDTO createUtilisateur(UtilisateurDTO utilisateurDTO, String passwordBrut);
    
    // Mise à jour (Profil)
    UtilisateurDTO updateUtilisateur(int id, UtilisateurDTO utilisateurDTO);
    
    void deleteUtilisateur(int id);
    
    // Méthode utilitaire pour changer le mot de passe séparement si besoin
    void changePassword(int id, String newPassword);
}
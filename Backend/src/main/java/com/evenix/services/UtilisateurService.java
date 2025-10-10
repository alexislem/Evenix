package com.evenix.services;

import com.evenix.dto.request.RegistrationRequest;
import com.evenix.entities.Role;
import com.evenix.entities.Utilisateur;

import java.util.List;
import java.util.Optional;

public interface UtilisateurService {
    List<Utilisateur> getAllUtilisateurs();
    Optional<Utilisateur> getUtilisateurById(int id);
    Optional<Utilisateur> findUtilisateurByNom(String utilisateurNom);
    Utilisateur createUtilisateur(Utilisateur utilisateur);
    Utilisateur saveUtilisateur(Utilisateur utilisateur);
    Utilisateur updateUtilisateur(int id, Utilisateur utilisateurDetails);
    void deleteUtilisateur(int id);

    // association rôle <-> utilisateur
    Utilisateur addRoleToUtilisateur(String utilisateurNom, String roleNom);
    Utilisateur addRoleToUtilisateur(Optional<Utilisateur> utilisateurOpt, Optional<Role> roleOpt);
    Utilisateur addRoleToUtilisateur(int utilisateurId, int roleId);
    Utilisateur registerUtilisateur(RegistrationRequest request);
    
}





 

package com.evenix.mappers;

import com.evenix.dto.UtilisateurDTO;
import com.evenix.dto.RoleDTO;
import com.evenix.dto.EntrepriseDTO;
import com.evenix.entities.Utilisateur;
import com.evenix.entities.Role;
import com.evenix.entities.Entreprise;

public final class UtilisateurMapper {

  private UtilisateurMapper() {}

  public static UtilisateurDTO fromEntity(Utilisateur u) {
    if (u == null) return null;

    UtilisateurDTO dto = new UtilisateurDTO();
    dto.setId(u.getId());
    dto.setNom(u.getNom());
    dto.setPrenom(u.getPrenom());
    dto.setEmail(u.getEmail());
    dto.setDateDeNaissance(u.getDateDeNaissance());
    dto.setTelephone(u.getTelephone());

    // Role
    Role role = u.getRole();
    if (role != null) {
      RoleDTO roleDTO = new RoleDTO();
      roleDTO.setId(role.getId());
      roleDTO.setNom(role.getNom());
      dto.setRole(roleDTO); // Correction ici : on passe bien le DTO
    }

    // Entreprise
    Entreprise ent = u.getEntreprise();
    if (ent != null) {
      EntrepriseDTO entDTO = new EntrepriseDTO();
      entDTO.setId(ent.getId());
      entDTO.setNom(ent.getNom());
      entDTO.setAdresse(ent.getAdresse()); // Ajout pour être complet
      entDTO.setEmail(ent.getEmail());     // Ajout pour être complet
      dto.setEntreprise(entDTO);
    }

    return dto;
  }
}
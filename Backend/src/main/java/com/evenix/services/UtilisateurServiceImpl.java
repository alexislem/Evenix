package com.evenix.services;

import com.evenix.dto.*;
import com.evenix.entities.*;
import com.evenix.repos.*;
import com.evenix.services.UtilisateurService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder; // Assurez-vous d'avoir ce bean configuré
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UtilisateurServiceImpl implements UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private EntrepriseRepository entrepriseRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<UtilisateurDTO> getAllUtilisateurs() {
        return utilisateurRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UtilisateurDTO getUtilisateurById(int id) {
        return utilisateurRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'id : " + id));
    }

    @Override
    public UtilisateurDTO getUtilisateurByEmail(String email) {
        return utilisateurRepository.findByEmail(email)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'email : " + email));
    }

    @Override
    public UtilisateurDTO createUtilisateur(UtilisateurDTO dto, String passwordBrut) {
        if (utilisateurRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé.");
        }

        Utilisateur user = new Utilisateur();
        user.setNom(dto.getNom());
        user.setPrenom(dto.getPrenom());
        user.setEmail(dto.getEmail());
        user.setTelephone(dto.getTelephone());
        user.setDateDeNaissance(dto.getDateDeNaissance());
        user.setDateCreation(LocalDateTime.now());
        user.setEstConfirme(false); // Par défaut

        // Encodage du mot de passe
        user.setMotDePasse(passwordEncoder.encode(passwordBrut));

        // Gestion du Rôle
        if (dto.getRole() != null) {
            Role role = roleRepository.findById(dto.getRole().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Rôle spécifié introuvable"));
            user.setRole(role);
        } else {
            // Rôle par défaut si non spécifié (ex: PARTICIPANT)
            Role roleDefaut = roleRepository.findByNom("PARTICIPANT")
                    .orElseThrow(() -> new RuntimeException("Rôle par défaut PARTICIPANT introuvable en base"));
            user.setRole(roleDefaut);
        }

        // Gestion Entreprise (optionnel)
        if (dto.getEntreprise() != null) {
            Entreprise ent = entrepriseRepository.findById(dto.getEntreprise().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Entreprise introuvable"));
            user.setEntreprise(ent);
        }

        Utilisateur saved = utilisateurRepository.save(user);
        return convertToDTO(saved);
    }

    @Override
    public UtilisateurDTO updateUtilisateur(int id, UtilisateurDTO dto) {
        Utilisateur user = utilisateurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));

        // Mise à jour des champs simples
        user.setNom(dto.getNom());
        user.setPrenom(dto.getPrenom());
        user.setTelephone(dto.getTelephone());
        user.setDateDeNaissance(dto.getDateDeNaissance());
        
        // On ne change l'email que s'il est différent et non pris
        if (!user.getEmail().equals(dto.getEmail())) {
            if (utilisateurRepository.existsByEmail(dto.getEmail())) {
                throw new IllegalArgumentException("Nouvel email déjà pris.");
            }
            user.setEmail(dto.getEmail());
        }

        // Mise à jour Entreprise
        if (dto.getEntreprise() != null) {
             Entreprise ent = entrepriseRepository.findById(dto.getEntreprise().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Entreprise introuvable"));
             user.setEntreprise(ent);
        } else {
            user.setEntreprise(null);
        }

        // Mise à jour Rôle (Attention : à sécuriser via contrôleur pour que seul un ADMIN puisse le faire)
        if (dto.getRole() != null && dto.getRole().getId() != user.getRole().getId()) {
            Role role = roleRepository.findById(dto.getRole().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Rôle introuvable"));
            user.setRole(role);
        }

        return convertToDTO(utilisateurRepository.save(user));
    }

    @Override
    public void deleteUtilisateur(int id) {
        utilisateurRepository.deleteById(id);
    }

    @Override
    public void changePassword(int id, String newPassword) {
        Utilisateur user = utilisateurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
        user.setMotDePasse(passwordEncoder.encode(newPassword));
        utilisateurRepository.save(user);
    }

    // --- Mappers ---

    private UtilisateurDTO convertToDTO(Utilisateur entity) {
        UtilisateurDTO dto = new UtilisateurDTO();
        dto.setId(entity.getId());
        dto.setNom(entity.getNom());
        dto.setPrenom(entity.getPrenom());
        dto.setEmail(entity.getEmail());
        dto.setTelephone(entity.getTelephone());
        dto.setDateDeNaissance(entity.getDateDeNaissance());

        if (entity.getRole() != null) {
            RoleDTO roleDTO = new RoleDTO();
            roleDTO.setId(entity.getRole().getId());
            roleDTO.setNom(entity.getRole().getNom());
            dto.setRole(roleDTO);
        }

        if (entity.getEntreprise() != null) {
            EntrepriseDTO entDTO = new EntrepriseDTO();
            entDTO.setId(entity.getEntreprise().getId());
            entDTO.setNom(entity.getEntreprise().getNom());
            entDTO.setEmail(entity.getEntreprise().getEmail());
            dto.setEntreprise(entDTO);
        }

        return dto;
    }
}
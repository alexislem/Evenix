package com.evenix.services;

import com.evenix.dto.*;
import com.evenix.entities.*;
import com.evenix.repos.*;
import com.evenix.services.EvenementService;
import com.evenix.services.LieuService; // On utilise le service pour la logique métier

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EvenementServiceImpl implements EvenementService {

    @Autowired
    private EvenementRepository evenementRepository;
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    
    // On injecte le Service au lieu du Repository pour bénéficier du dédoublonnage Google
    @Autowired
    private LieuServiceImpl lieuService; 

    @Override
    public List<EvenementDTO> getAllEvenements() {
        return evenementRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EvenementDTO getEvenementById(int id) {
        Evenement evenement = evenementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Événement non trouvé id: " + id));
        return convertToDTO(evenement);
    }

    @Override
    public EvenementDTO createEvenement(EvenementDTO dto, int organisateurId) {
        Utilisateur organisateur = utilisateurRepository.findById(organisateurId)
                .orElseThrow(() -> new EntityNotFoundException("Organisateur non trouvé"));

        Evenement evenement = new Evenement();
        updateEntityFromDTO(evenement, dto);
        
        evenement.setUtilisateur(organisateur);

        // GESTION DU LIEU VIA LE SERVICE (Google Maps & Dédoublonnage)
        if (dto.getLieu() != null) {
            // 1. On crée ou récupère le lieu via le service (vérifie googlePlaceId)
            LieuDTO savedLieuDto = lieuService.createLieu(dto.getLieu());
            
            // 2. On récupère l'entité brute pour faire la liaison JPA
            // (Nécessite la méthode getLieuEntityById dans LieuService)
            Lieu lieuEntity = lieuService.getLieuEntityById(savedLieuDto.getId());
            evenement.setLieu(lieuEntity);
        }

        Evenement saved = evenementRepository.save(evenement);
        return convertToDTO(saved);
    }

    @Override
    public EvenementDTO updateEvenement(int id, EvenementDTO dto) {
        Evenement existing = evenementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Événement non trouvé"));

        updateEntityFromDTO(existing, dto);

        if (dto.getLieu() != null) {
             LieuDTO savedLieuDto = lieuService.createLieu(dto.getLieu());
             Lieu lieuEntity = lieuService.getLieuEntityById(savedLieuDto.getId());
             existing.setLieu(lieuEntity);
        }

        Evenement updated = evenementRepository.save(existing);
        return convertToDTO(updated);
    }

    @Override
    public void deleteEvenement(int id) {
        if (!evenementRepository.existsById(id)) {
            throw new EntityNotFoundException("Impossible de supprimer : Événement introuvable");
        }
        evenementRepository.deleteById(id);
    }

    @Override
    public List<EvenementDTO> getEvenementsByOrganisateur(int organisateurId) {
        return evenementRepository.findByUtilisateurId(organisateurId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // --- Helpers Mapping ---

    private void updateEntityFromDTO(Evenement entity, EvenementDTO dto) {
        entity.setNom(dto.getNom());
        entity.setDescription(dto.getDescription());
        entity.setDateDebut(dto.getDateDebut());
        entity.setDateFin(dto.getDateFin());
        entity.setPrix(dto.getPrix());
        entity.setImageUrl(dto.getImageUrl());
    }

    private EvenementDTO convertToDTO(Evenement entity) {
        EvenementDTO dto = new EvenementDTO();
        dto.setId(entity.getId());
        dto.setNom(entity.getNom());
        dto.setDescription(entity.getDescription());
        dto.setDateDebut(entity.getDateDebut());
        dto.setDateFin(entity.getDateFin());
        dto.setPrix(entity.getPrix());
        dto.setImageUrl(entity.getImageUrl());
        

        // Mapping Utilisateur
        if (entity.getUtilisateur() != null) {
            UtilisateurDTO userDto = new UtilisateurDTO();
            userDto.setId(entity.getUtilisateur().getId());
            userDto.setNom(entity.getUtilisateur().getNom());
            userDto.setPrenom(entity.getUtilisateur().getPrenom());
            dto.setUtilisateur(userDto);
        }

        // Mapping COMPLET du Lieu (C'est ici que la correction est appliquée)
        if (entity.getLieu() != null) {
            Lieu l = entity.getLieu();
            LieuDTO lieuDto = new LieuDTO();
            
            lieuDto.setId(l.getId());
            lieuDto.setNom(l.getNom());
            lieuDto.setAdresse(l.getAdresse());
            lieuDto.setVille(l.getVille());           // Ajouté
            lieuDto.setCodePostal(l.getCodePostal()); // Ajouté
            lieuDto.setLatitude(l.getLatitude());     // Ajouté
            lieuDto.setLongitude(l.getLongitude());   // Ajouté
            lieuDto.setTypeLieu(l.getTypeLieu());     // Ajouté
            lieuDto.setGooglePlaceId(l.getGooglePlaceId()); // Ajouté
            lieuDto.setCapaciteMax(l.getCapaciteMax());
            
            dto.setLieu(lieuDto);
            
            // On remplit aussi la ville au niveau de l'événement pour faciliter l'affichage frontend
        }

        return dto;
    }
}
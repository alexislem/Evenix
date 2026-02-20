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

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
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
                .orElseThrow(() -> new EntityNotFoundException("Événement introuvable"));
        return convertToDTO(evenement);
    }

    @Override
    @Transactional
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
            Lieu savedLieuEntity = lieuService.getLieuEntityById(savedLieuDto.getId());

            // 3. On lie l'événement à ce lieu
            evenement.setLieu(savedLieuEntity);
        }

        Evenement saved = evenementRepository.save(evenement);
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public EvenementDTO updateEvenement(int id, EvenementDTO dto) {
        Evenement evenement = evenementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Événement introuvable"));

        updateEntityFromDTO(evenement, dto);

        // Mise à jour du lieu via le service (dédoublonnage + Google)
        if (dto.getLieu() != null) {
            LieuDTO savedLieuDto = lieuService.createLieu(dto.getLieu());
            Lieu savedLieuEntity = lieuService.getLieuEntityById(savedLieuDto.getId());
            evenement.setLieu(savedLieuEntity);
        }

        Evenement updated = evenementRepository.save(evenement);
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

    @Override
    public List<EvenementDTO> getEvenementsBetweenDates(LocalDateTime start, LocalDateTime end) {
        return evenementRepository.findByDateDebutBetween(start, end).stream()
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

        // Mapping UTILISATEUR (organisateur)
        if (entity.getUtilisateur() != null) {
            UtilisateurDTO userDto = new UtilisateurDTO();
            userDto.setId(entity.getUtilisateur().getId());
            userDto.setNom(entity.getUtilisateur().getNom());
            userDto.setPrenom(entity.getUtilisateur().getPrenom());
            dto.setUtilisateur(userDto);
        }

        // Mapping COMPLET du Lieu
        if (entity.getLieu() != null) {
            Lieu l = entity.getLieu();
            LieuDTO lieuDto = new LieuDTO();

            lieuDto.setId(l.getId());
            lieuDto.setNom(l.getNom());
            lieuDto.setAdresse(l.getAdresse());
            lieuDto.setVille(l.getVille());
            lieuDto.setCodePostal(l.getCodePostal());
            lieuDto.setLatitude(l.getLatitude());
            lieuDto.setLongitude(l.getLongitude());
            lieuDto.setTypeLieu(l.getTypeLieu());
            lieuDto.setGooglePlaceId(l.getGooglePlaceId());
            lieuDto.setCapaciteMax(l.getCapaciteMax());

            dto.setLieu(lieuDto);
        }

        return dto;
    }
}

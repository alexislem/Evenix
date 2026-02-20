package com.evenix.services;

import com.evenix.dto.*;
import com.evenix.entities.*;
import com.evenix.repos.*;
import com.evenix.services.InscriptionService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InscriptionServiceImpl implements InscriptionService {

    @Autowired
    private InscriptionRepository inscriptionRepository;
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    @Autowired
    private EvenementRepository evenementRepository;

    @Override
    public InscriptionDTO inscrireUtilisateur(int utilisateurId, int evenementId) {
        Utilisateur user = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
        
        Evenement event = evenementRepository.findById(evenementId)
                .orElseThrow(() -> new EntityNotFoundException("Événement non trouvé"));

        // Vérification Capacité
        if (event.getLieu() != null) {
            int capaciteMax = event.getLieu().getCapaciteMax();
            int inscritsActuels = event.getInscriptions().size(); // Attention, peut être lourd si beaucoup d'inscrits, préférer un count SQL
            if (inscritsActuels >= capaciteMax) {
                throw new IllegalStateException("L'événement est complet !");
            }
        }

        // Vérification doublon
        boolean dejaInscrit = event.getInscriptions().stream()
                .anyMatch(i -> i.getUtilisateur().getId() == utilisateurId);
        if (dejaInscrit) {
            throw new IllegalArgumentException("Utilisateur déjà inscrit à cet événement");
        }

        Inscription inscription = new Inscription(user, event);
        inscription.setStatut("CONFIRMEE"); // Ou EN_ATTENTE si paiement requis
        
        Inscription saved = inscriptionRepository.save(inscription);
        return convertToDTO(saved);
    }

    @Override
    public void annulerInscription(int inscriptionId) {
        Inscription inscription = inscriptionRepository.findById(inscriptionId)
                .orElseThrow(() -> new EntityNotFoundException("Inscription introuvable"));
        
        // Logique métier : suppression ou changement de statut
        // inscription.setStatut("ANNULEE");
        // inscriptionRepository.save(inscription);
        
        // Ou suppression physique
        inscriptionRepository.delete(inscription);
    }

    @Override
    public List<InscriptionDTO> getInscriptionsByUtilisateur(int utilisateurId) {
        return inscriptionRepository.findByUtilisateurId(utilisateurId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<InscriptionDTO> getInscriptionsByEvenement(int evenementId) {
        return inscriptionRepository.findByEvenementId(evenementId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private InscriptionDTO convertToDTO(Inscription entity) {
        InscriptionDTO dto = new InscriptionDTO();
        dto.setId(entity.getId());
        dto.setDateInscription(entity.getDateInscription());
        dto.setStatut(entity.getStatut());

        // Mapping Event (Simplifié)
        EvenementDTO eventDto = new EvenementDTO();
        eventDto.setId(entity.getEvenement().getId());
        eventDto.setNom(entity.getEvenement().getNom());
        eventDto.setDateDebut(entity.getEvenement().getDateDebut());
        dto.setEvenement(eventDto);

        // Mapping User (Simplifié)
        UtilisateurDTO userDto = new UtilisateurDTO();
        userDto.setId(entity.getUtilisateur().getId());
        userDto.setNom(entity.getUtilisateur().getNom());
        userDto.setPrenom(entity.getUtilisateur().getPrenom());
        userDto.setEmail(entity.getUtilisateur().getEmail());
        dto.setUtilisateur(userDto);

        return dto;
    }
}
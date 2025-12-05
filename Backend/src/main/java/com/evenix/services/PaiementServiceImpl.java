package com.evenix.services;

import com.evenix.dto.PaiementDTO;
import com.evenix.entities.Inscription;
import com.evenix.entities.Paiement;
import com.evenix.repos.InscriptionRepository;
import com.evenix.repos.PaiementRepository;
import com.evenix.services.PaiementService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaiementServiceImpl implements PaiementService {

    @Autowired
    private PaiementRepository paiementRepository;
    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Override
    public PaiementDTO traiterPaiement(PaiementDTO dto) {
        // 1. Récupérer l'inscription concernée
        Inscription inscription = inscriptionRepository.findById(dto.getInscriptionId())
                .orElseThrow(() -> new EntityNotFoundException("Inscription introuvable"));

        // 2. Créer le paiement
        Paiement paiement = new Paiement();
        paiement.setMontant(dto.getMontant());
        paiement.setMoyenPaiement(dto.getMoyenPaiement());
        paiement.setStatut("SUCCES"); // On suppose un succès pour l'instant (simulation)
        paiement.setDatePaiement(LocalDateTime.now());
        paiement.setInscription(inscription);

        // 3. Mettre à jour le statut de l'inscription
        inscription.setStatut("CONFIRMEE");
        inscriptionRepository.save(inscription);

        // 4. Sauvegarder le paiement
        Paiement saved = paiementRepository.save(paiement);
        return convertToDTO(saved);
    }

    @Override
    public PaiementDTO getPaiementById(int id) {
        return paiementRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Paiement non trouvé"));
    }

    @Override
    public List<PaiementDTO> getAllPaiements() {
        return paiementRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private PaiementDTO convertToDTO(Paiement entity) {
        PaiementDTO dto = new PaiementDTO();
        dto.setId(entity.getId());
        dto.setMontant(entity.getMontant());
        dto.setDatePaiement(entity.getDatePaiement());
        dto.setMoyenPaiement(entity.getMoyenPaiement());
        dto.setStatut(entity.getStatut());
        
        if (entity.getInscription() != null) {
            dto.setInscriptionId(entity.getInscription().getId());
        }
        
        return dto;
    }
}
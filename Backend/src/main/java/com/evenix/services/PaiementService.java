package com.evenix.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.evenix.dto.PaiementDTO;
import com.evenix.entities.Evenement;
import com.evenix.entities.Paiement;
import com.evenix.entities.Utilisateur;
import com.evenix.repos.EvenementRepository;
import com.evenix.repos.PaiementRepository;
import com.evenix.repos.UtilisateurRepository;

@Service
public class PaiementService {

    private final PaiementRepository paiementRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final EvenementRepository evenementRepository;

    public PaiementService(PaiementRepository paiementRepository,
                           UtilisateurRepository utilisateurRepository,
                           EvenementRepository evenementRepository) {
        this.paiementRepository = paiementRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.evenementRepository = evenementRepository;
    }

    public List<Paiement> getAllPaiements() {
        return paiementRepository.findAll();
    }

    public Optional<Paiement> getPaiementById(int id) {
        return paiementRepository.findById(id);
    }

    public Paiement createPaiement(PaiementDTO dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(dto.getUtilisateurId())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        Evenement evenement = evenementRepository.findById(dto.getEvenementId())
            .orElseThrow(() -> new RuntimeException("Evenement non trouvé"));

        Paiement paiement = new Paiement();
        paiement.setMontant(dto.getMontant());
        paiement.setDate(dto.getDate());
        paiement.setCode(dto.getCode());
        paiement.setUtilisateur(utilisateur);
        paiement.setEvenement(evenement);

        return paiementRepository.save(paiement);
    }

    public void deletePaiement(int id) {
        paiementRepository.deleteById(id);
    }
}

package com.evenix.services;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.evenix.entities.Evenement;
import com.evenix.entities.Inscription;
import com.evenix.entities.Utilisateur;
import com.evenix.repos.EvenementRepository;
import com.evenix.repos.InscriptionRepository;
import com.evenix.repos.UtilisateurRepository;

@Service
public class InscriptionServiceImpl implements InscriptionService {

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private EvenementRepository evenementRepository;

    @Override
    public Inscription createInscription(int utilisateurId, int evenementId, ZonedDateTime dateInscription) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable avec l'ID : " + utilisateurId));

        Evenement evenement = evenementRepository.findById(evenementId)
                .orElseThrow(() -> new IllegalArgumentException("Évènement introuvable avec l'ID : " + evenementId));

        // Vérification si déjà inscrit et actif
        boolean alreadyRegistered = inscriptionRepository.findByUtilisateur(utilisateur).stream()
                .anyMatch(i -> i.getEvenement().getId() == evenementId && i.getDateAnnulation() == null);
        
        if (alreadyRegistered) {
             throw new IllegalArgumentException("L'utilisateur est déjà inscrit à cet événement.");
        }

        Inscription inscription = new Inscription(utilisateur, evenement, dateInscription);
        return inscriptionRepository.save(inscription);
    }

    @Override
    public List<Inscription> getInscriptionsByUtilisateurId(int utilisateurId) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
        
        return inscriptionRepository.findByUtilisateur(utilisateur);
    }

    @Override
    public void deleteInscription(int inscriptionId) {
        // Modification pour désinscription logique (soft delete)
        Inscription inscription = inscriptionRepository.findById(inscriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Inscription introuvable avec l'ID : " + inscriptionId));
        
        inscription.setDateAnnulation(ZonedDateTime.now());
        inscriptionRepository.save(inscription);
    }
}
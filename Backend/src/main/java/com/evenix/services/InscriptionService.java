package com.evenix.services;

import java.time.ZonedDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.evenix.entities.Evenement;
import com.evenix.entities.Inscription;
import com.evenix.entities.Utilisateur;
import com.evenix.repos.EvenementRepository;
import com.evenix.repos.InscriptionRepository;
import com.evenix.repos.UtilisateurRepository;

@Service
public class InscriptionService {

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private EvenementRepository evenementRepository;

    public Inscription createInscription(int utilisateurId, int evenementId, ZonedDateTime dateInscription) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable avec l'ID : " + utilisateurId));

        Evenement evenement = evenementRepository.findById(evenementId)
                .orElseThrow(() -> new IllegalArgumentException("Évènement introuvable avec l'ID : " + evenementId));

        Inscription inscription = new Inscription(utilisateur, evenement, dateInscription);
        return inscriptionRepository.save(inscription);
    }
}

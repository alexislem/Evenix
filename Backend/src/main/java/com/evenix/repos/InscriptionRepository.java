package com.evenix.repos;

import java.time.ZonedDateTime;
import java.util.List; // Import obligatoire
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.evenix.entities.Evenement;
import com.evenix.entities.Inscription;
import com.evenix.entities.Utilisateur;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, Integer> {
    // ⚠️ CORRECTION MAJEURE ICI : On retourne une LISTE
    List<Inscription> findByUtilisateur(Utilisateur utilisateur);
    
    Optional<Inscription> findById(int id);
    
    // On retourne aussi une liste ici (plusieurs inscrits par événement)
    List<Inscription> findByEvenement(Evenement evenement); 
    
    Optional<Inscription> findByDateInscription(ZonedDateTime dateinscription);
    Optional<Inscription> findByDateAnnulation(ZonedDateTime dateannulation);
}
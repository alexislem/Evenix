package com.evenix.repos;

import com.evenix.entities.Evenement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EvenementRepository extends JpaRepository<Evenement, Integer> {
    
    // Récupérer tous les événements créés par un organisateur spécifique
    List<Evenement> findByUtilisateurId(int utilisateurId);
    
    // CORRECTION ICI : On cherche via la propriété "ville" de l'objet "lieu"
    // Anciennement : findByVille(String ville);
    List<Evenement> findByLieuVille(String ville);
    
    // Recherche par nom (insensible à la casse)
    List<Evenement> findByNomContainingIgnoreCase(String nom);
    
    List<Evenement> findByDateDebutBetween(LocalDateTime start, LocalDateTime end);

}
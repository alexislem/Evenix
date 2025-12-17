package com.evenix.repos;

import com.evenix.entities.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InscriptionRepository extends JpaRepository<Inscription, Integer> {

    // Récupérer l'historique des inscriptions d'un utilisateur (pour son tableau de bord)
    List<Inscription> findByUtilisateurId(int utilisateurId);

    // Récupérer toutes les inscriptions pour un événement donné (pour l'organisateur)
    List<Inscription> findByEvenementId(int evenementId);

    // ✅ Compter le nombre d'inscriptions pour un événement donné (pour le dashboard admin)
    long countByEvenementId(int evenementId);
}

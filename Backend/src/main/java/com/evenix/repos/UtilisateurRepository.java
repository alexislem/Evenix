package com.evenix.repos;

import com.evenix.entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {
    
    // Utilisé pour le login (recherche par email)
    Optional<Utilisateur> findByEmail(String email);
    
    // Utilisé parfois pour la recherche par nom
    Optional<Utilisateur> findByNom(String nom);
    
    // Utilisé lors de l'inscription pour vérifier si l'email est pris
    boolean existsByEmail(String email);
}
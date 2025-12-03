package com.evenix.repos;

import com.evenix.entities.Lieu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LieuRepository extends JpaRepository<Lieu, Integer> {
    // Permet de vérifier si le lieu existe déjà via l'API Google
    Optional<Lieu> findByGooglePlaceId(String googlePlaceId);
}
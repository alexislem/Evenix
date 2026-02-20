package com.evenix.repos;

import com.evenix.entities.TypeEvenement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TypeEvenementRepository extends JpaRepository<TypeEvenement, Integer> {
    Optional<TypeEvenement> findByNom(String nom);
}
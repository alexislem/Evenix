package com.evenix.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.TypeEvenement;

@RepositoryRestResource(path = "rest")
public interface TypeEvenementRepository extends JpaRepository<TypeEvenement, Integer> {
	Optional<TypeEvenement> findByNom(String nom);
	Optional<TypeEvenement> findById(int id);
}

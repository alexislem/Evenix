package com.evenix.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.TypeEvenement;

@RepositoryRestResource(path = "rest")
public interface TypeEvenementRepository extends JpaRepository<TypeEvenement, Integer> {
	List<TypeEvenement> findByNom(String nom);
	List<TypeEvenement> findById(int id);
}

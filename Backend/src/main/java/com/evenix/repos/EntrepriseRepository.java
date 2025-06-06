package com.evenix.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.Entreprise;

@RepositoryRestResource(path = "rest")
public interface EntrepriseRepository extends JpaRepository<Entreprise, Integer> {
	Optional<Entreprise> findByNom(String Nom);
	Optional<Entreprise> findById(int id);
	Optional<Entreprise> findBySecteurActivite(String secteuractivite);	
}

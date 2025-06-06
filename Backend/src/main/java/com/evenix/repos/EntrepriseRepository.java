package com.evenix.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.Entreprise;

@RepositoryRestResource(path = "rest")
public interface EntrepriseRepository extends JpaRepository<Entreprise, Integer> {
	List<EntrepriseRepository> findByNom(String Nom);
	List<EntrepriseRepository> findById(int id);
	List<EntrepriseRepository> findBySecteurActivite(String secteuractivite);	
}

package com.evenix.repos;

import java.time.ZonedDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.Evenement;
import com.evenix.entities.Inscription;
import com.evenix.entities.Utilisateur;

@RepositoryRestResource(path = "rest")
public interface InscriptionRepository extends JpaRepository<Inscription, Integer> {
	Optional<Inscription> findByUtilisateur(Utilisateur utilisateur);
	Optional<Inscription> findById(int id);
	Optional<Inscription> findByEvenement(Evenement evenement);
	Optional<Inscription> findByDateInscription(ZonedDateTime dateinscription);
	Optional<Inscription> findByDateAnnulation(ZonedDateTime dateannulation);
}

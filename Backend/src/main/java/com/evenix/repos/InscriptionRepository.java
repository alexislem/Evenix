package com.evenix.repos;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.Evenement;
import com.evenix.entities.Inscription;
import com.evenix.entities.Utilisateur;

@RepositoryRestResource(path = "rest")
public interface InscriptionRepository extends JpaRepository<Inscription, Integer> {
	List<InscriptionRepository> findByUtilisateur(Utilisateur utilisateur);
	List<InscriptionRepository> findById(int id);
	List<InscriptionRepository> findByEvenement(Evenement evenement);
	List<InscriptionRepository> findByDateInscription(ZonedDateTime dateinscription);
	List<InscriptionRepository> findByDateAnnulation(ZonedDateTime dateannulation);
}

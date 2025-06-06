package com.evenix.repos;

import java.time.ZonedDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.Evenement;
import com.evenix.entities.Paiement;
import com.evenix.entities.Utilisateur;

@RepositoryRestResource(path = "rest")
public interface PaiementRepository extends JpaRepository<Paiement, Integer> {
	Optional<Paiement> findById(int id);
	Optional<Paiement> findByUtilisateur(Utilisateur utilisateur);
	Optional<Paiement> findByEvenement(Evenement evenement);
	Optional<Paiement> findByDate(ZonedDateTime date);
	Optional<Paiement> findByCode(String code);

}

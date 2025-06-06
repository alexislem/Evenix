package com.evenix.repos;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.Evenement;
import com.evenix.entities.Paiement;
import com.evenix.entities.Utilisateur;

@RepositoryRestResource(path = "rest")
public interface PaiementRepository extends JpaRepository<Paiement, Integer> {
	List<PaiementRepository> findById(int id);
	List<PaiementRepository> findByUtilisateur(Utilisateur utilisateur);
	List<PaiementRepository> findByEvenement(Evenement evenement);
	List<PaiementRepository> findByDate(ZonedDateTime date);
	List<PaiementRepository> findByCode(String code);

}

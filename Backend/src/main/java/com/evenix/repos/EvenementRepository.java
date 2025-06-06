package com.evenix.repos;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.Evenement;
import com.evenix.entities.Lieu;
import com.evenix.entities.TypeEvenement;
import com.evenix.entities.Utilisateur;

@RepositoryRestResource(path = "rest")
public interface EvenementRepository extends JpaRepository<Evenement, Integer> {
	List<EvenementRepository> findById(int id);
	List<EvenementRepository> findByNom(String nom);
	List<EvenementRepository> findByDateDebut(ZonedDateTime dateDebut);
	List<EvenementRepository> findByDateFin(ZonedDateTime dateFin);
	List<EvenementRepository> findByPrix(float prix);
	List<EvenementRepository> findByUtilisateur(Utilisateur utilisateur);
	List<EvenementRepository> findByLieu(Lieu lieu);
	List<EvenementRepository> findByTypesEvenements(Set<TypeEvenement> typesEvenements);
}

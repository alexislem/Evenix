package com.evenix.repos;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Pageable;   // <<< BON import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.Evenement;
import com.evenix.entities.Lieu;
import com.evenix.entities.TypeEvenement;
import com.evenix.entities.Utilisateur;

@RepositoryRestResource(path = "rest")
public interface EvenementRepository extends JpaRepository<Evenement, Integer> {
    Optional<Evenement> findById(int id);
    Optional<Evenement> findByNom(String nom);
    Optional<Evenement> findByDateDebut(ZonedDateTime dateDebut);
    Optional<Evenement> findByDateFin(ZonedDateTime dateFin);
    Optional<Evenement> findByPrix(float prix);
    Optional<Evenement> findByUtilisateur(Utilisateur utilisateur);
    Optional<Evenement> findByLieu(Lieu lieu);
    Optional<Evenement> findByTypesEvenement(Set<TypeEvenement> typesEvenements);

    List<Evenement> findByDateDebutAfterOrderByDateDebutAsc(ZonedDateTime now, Pageable pageable);
}

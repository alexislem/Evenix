package com.evenix.repos;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.Entreprise;
import com.evenix.entities.Role;
import com.evenix.entities.Utilisateur;

@RepositoryRestResource(path = "rest")
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {
	Optional<Utilisateur> findByNom(String Nom);
	Optional<Utilisateur> findByPrenom(String Prenom);
	Optional<Utilisateur> findById(int id);
	Optional<Utilisateur> findByDateDeNaissance(Date dateNaissance);
	Optional<Utilisateur> findByEmail(String email);
	Optional<Utilisateur> findByRole(Role role);
	Optional<Utilisateur> findByEntreprise(Entreprise entreprise);
	Optional<Utilisateur> findByDateCreation(LocalDate dateCreation);
	boolean existsByEmail(String email);
}

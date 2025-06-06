package com.evenix.repos;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.Entreprise;
import com.evenix.entities.Role;
import com.evenix.entities.Utilisateur;

@RepositoryRestResource(path = "rest")
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {
	List<UtilisateurRepository> findByNom(String Nom);
	List<UtilisateurRepository> findByPrenom(String Prenom);
	List<UtilisateurRepository> findById(int id);
	List<UtilisateurRepository> findByDateDeNaissance(Date dateNaissance);
	List<UtilisateurRepository> findByEmail(String email);
	List<UtilisateurRepository> findByRole(Role role);
	List<UtilisateurRepository> findByEntreprise(Entreprise entreprise);
}

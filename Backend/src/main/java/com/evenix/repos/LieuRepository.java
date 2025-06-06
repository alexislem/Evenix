package com.evenix.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.Lieu;

@RepositoryRestResource(path = "rest")
public interface LieuRepository extends JpaRepository<Lieu, Integer> {
	Optional<Lieu> findById(int id);
	Optional<Lieu> findByNom(String nom);
	

}

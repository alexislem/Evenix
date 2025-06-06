package com.evenix.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.Lieu;

@RepositoryRestResource(path = "rest")
public interface LieuRepository extends JpaRepository<Lieu, Integer> {
	List<LieuRepository> findById(int id);
	List<LieuRepository> findByNom(String nom);
	

}

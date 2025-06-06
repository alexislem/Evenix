package com.evenix.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.TypeLieuCulturel;

@RepositoryRestResource(path = "rest")
public interface TypeLieuCulturelRepository extends JpaRepository<TypeLieuCulturel, Integer> {
	Optional<TypeLieuCulturel> findByNom(String nom);
	Optional<TypeLieuCulturel> findById(int id);	
}

package com.evenix.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.TypeLieuCulturel;

@RepositoryRestResource(path = "rest")
public interface TypeLieuCulturelRepository extends JpaRepository<TypeLieuCulturel, Integer> {
	List<TypeLieuCulturelRepository> findByNom(String nom);
	List<TypeLieuCulturelRepository> findById(int id);	
}

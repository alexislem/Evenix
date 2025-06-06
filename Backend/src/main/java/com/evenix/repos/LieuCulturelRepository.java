package com.evenix.repos;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.Evenement;
import com.evenix.entities.LieuCulturel;
import com.evenix.entities.TypeLieuCulturel;

@RepositoryRestResource(path = "rest")
public interface LieuCulturelRepository extends JpaRepository<LieuCulturel, Integer> {
	List<LieuCulturelRepository> findById(int id);
	List<LieuCulturelRepository> findByNom(String nom);
	List<LieuCulturelRepository> findByTypeLieuCulturel(TypeLieuCulturel typeLieuCulturel);
	List<LieuCulturelRepository> findByEvenementsProche(Set<Evenement> evenementsProche);

}

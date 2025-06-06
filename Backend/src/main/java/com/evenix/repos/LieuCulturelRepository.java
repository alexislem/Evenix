package com.evenix.repos;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.Evenement;
import com.evenix.entities.LieuCulturel;
import com.evenix.entities.TypeLieuCulturel;

@RepositoryRestResource(path = "rest")
public interface LieuCulturelRepository extends JpaRepository<LieuCulturel, Integer> {
	Optional<LieuCulturel> findById(int id);
	Optional<LieuCulturel> findByNom(String nom);
	Optional<LieuCulturel> findByTypeLieuCulturel(TypeLieuCulturel typeLieuCulturel);
	Optional<LieuCulturel> findByEvenementsProche(Set<Evenement> evenementsProche);

}

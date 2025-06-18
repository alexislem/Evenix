package com.evenix.repos;

import com.evenix.entities.TypeLieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TypeLieuRepository extends JpaRepository<TypeLieu, Integer> {

    Optional<TypeLieu> findByLibelle(String libelle);
}

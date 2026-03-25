package com.evenix.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.evenix.entities.Favoris;

public interface FavorisRepository extends JpaRepository<Favoris, Integer> {

}

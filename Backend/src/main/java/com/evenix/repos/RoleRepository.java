package com.evenix.repos;

import java.util.Optional;

//import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.Role;

@RepositoryRestResource(path = "rest")
public interface RoleRepository extends JpaRepository <Role, Integer> {
	Optional<Role> findByNom(String nom);
	Optional<Role> findById(int id);
}

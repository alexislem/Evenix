package com.evenix.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.evenix.entities.Role;

@RepositoryRestResource(path = "rest")
public interface RoleRepository extends JpaRepository <Role, Integer> {
	List<RoleRepository> findByNom(String nom);
	List<RoleRepository> findById(int id);
}

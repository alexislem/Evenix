package com.evenix.repos;

import com.evenix.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    
    // Essentiel pour assigner un rôle par son nom (ex: "ADMIN", "ORGANISATEUR")
    Optional<Role> findByNom(String nom);
}
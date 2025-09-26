package com.evenix.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.evenix.entities.Role;
import com.evenix.repos.RoleRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    /* Récupérer tous les rôles */
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    /* Récupérer un rôle par son id */
    public Role getRoleById(int id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role non trouvé avec id=" + id));
    }

    /* Créer un rôle */
    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    /* Mettre à jour un rôle existant */
    public Role updateRole(int id, Role updatedRole) {
        return roleRepository.findById(id)
                .map(existing -> {
                    existing.setNom(updatedRole.getNom());
                    return roleRepository.save(existing);
                })
                .orElseThrow(() -> new EntityNotFoundException("Role non trouvé avec id=" + id));
    }

    /* Supprimer un rôle */
    public void deleteRole(int id) {
        roleRepository.deleteById(id);
    }
}

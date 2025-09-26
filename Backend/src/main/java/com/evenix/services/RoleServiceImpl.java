package com.evenix.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.evenix.entities.Role;
import com.evenix.repos.RoleRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class RoleServiceImpl implements RoleService{
    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    /* Récupérer tous les rôles */
    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    /* Récupérer un rôle par son id */
    @Override
    public Role getRoleById(int id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role non trouvé avec id=" + id));
    }

    /* Créer un rôle */
    @Override
    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    /* Mettre à jour un rôle existant */
    @Override
    public Role updateRole(int id, Role updatedRole) {
        return roleRepository.findById(id)
                .map(existing -> {
                    existing.setNom(updatedRole.getNom());
                    return roleRepository.save(existing);
                })
                .orElseThrow(() -> new EntityNotFoundException("Role non trouvé avec id=" + id));
    }

    /* Supprimer un rôle */
    @Override
    public void deleteRole(int id) {
        roleRepository.deleteById(id);
    }
}

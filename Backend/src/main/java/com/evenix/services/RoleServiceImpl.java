package com.evenix.services;

import com.evenix.dto.RoleDTO;
import com.evenix.entities.Role;
import com.evenix.repos.RoleRepository;
import com.evenix.services.RoleService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RoleDTO getRoleById(int id) {
        return roleRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Rôle non trouvé"));
    }

    @Override
    public RoleDTO createRole(RoleDTO dto) {
        Role role = new Role();
        role.setNom(dto.getNom());
        return convertToDTO(roleRepository.save(role));
    }

    @Override
    public void deleteRole(int id) {
        roleRepository.deleteById(id);
    }

    private RoleDTO convertToDTO(Role role) {
        RoleDTO dto = new RoleDTO();
        dto.setId(role.getId());
        dto.setNom(role.getNom());
        return dto;
    }
}
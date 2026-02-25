package com.evenix.mappers;

import com.evenix.dto.RoleDTO;
import com.evenix.entities.Role;

public class RoleMapper {


    public static RoleDTO fromEntity(Role role) {
        if (role == null) {
            return null;
        }

        RoleDTO roleDTO = new RoleDTO();
        roleDTO.setId(role.getId());
        roleDTO.setNom(role.getNom());
        
        return roleDTO;
    }


    public static Role toEntity(RoleDTO roleDTO) {
        if (roleDTO == null) {
            return null;
        }

        Role role = new Role();
        role.setId(roleDTO.getId());
        role.setNom(roleDTO.getNom());
        
        return role;
    }
}
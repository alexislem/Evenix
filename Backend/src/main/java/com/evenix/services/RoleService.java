package com.evenix.services;

import com.evenix.dto.RoleDTO;
import java.util.List;

public interface RoleService {
    List<RoleDTO> getAllRoles();
    RoleDTO getRoleById(int id);
    RoleDTO createRole(RoleDTO roleDTO);
    void deleteRole(int id);
}
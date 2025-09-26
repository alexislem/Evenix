package com.evenix.services;

import com.evenix.entities.Role;

import java.util.List;

public interface RoleService {
    List<Role> getAllRoles();
    Role getRoleById(int id);
    Role createRole(Role role);
    Role updateRole(int id, Role updatedRole);
    void deleteRole(int id);
}

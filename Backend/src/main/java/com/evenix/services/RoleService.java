package com.evenix.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.evenix.entities.Role;
import com.evenix.repos.RoleRepository;

@Service
public class RoleService {
	private final RoleRepository roleRepository;
	
	public RoleService(RoleRepository roleRepository) {
		this.roleRepository = roleRepository;
	}
	
	public List<Role> getAllRoles(){
		return roleRepository.findAll();
		}
	
	public Optional<Role> getRoleById(int id){
		return roleRepository.findById(id);
	}
	
	public Role createRole(Role role) {
		return roleRepository.save(role);
	}
	
	public Role updateRole(int id, Role updatedRole) {
		return roleRepository.findById(id)
				.map(e -> {
					e.setNom(updatedRole.getNom());
					return roleRepository.save(e);
					
				})
				.orElseGet(() -> { 
					return roleRepository.save(updatedRole);
				});
	}
	
	public void deleteRole(int id) {
		roleRepository.deleteById(id);
	}
	
	
}


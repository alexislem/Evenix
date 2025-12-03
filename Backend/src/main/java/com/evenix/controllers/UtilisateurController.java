package com.evenix.controllers;

import com.evenix.dto.UtilisateurDTO;
import com.evenix.entities.Role;
import com.evenix.entities.Utilisateur;
import com.evenix.repos.RoleRepository;
import com.evenix.services.UtilisateurServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // <--- AJOUT IMPORTANT ICI

@RestController
@RequestMapping("/api/utilisateur")
public class UtilisateurController {

    @Autowired
    private UtilisateurServiceImpl utilisateurService;

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/all")
    public List<UtilisateurDTO> getAllUtilisateurs() {
        return utilisateurService.getAllUtilisateurs();
    }
    
    @GetMapping("/count")
    public int getNombresUtilisateurs() {
        return utilisateurService.getNombresUtilisateurs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable int id) {
        return utilisateurService.getUtilisateurById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Utilisateur> createUtilisateur(@RequestBody Utilisateur utilisateur) {
        int roleId = utilisateur.getRole() != null ? utilisateur.getRole().getId() : -1;
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new RuntimeException("Role non trouvé avec id = " + roleId));

        utilisateur.setRole(role);

        Utilisateur savedUtilisateur = utilisateurService.createUtilisateur(utilisateur);
        return ResponseEntity.ok(savedUtilisateur);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> updateUtilisateur(@PathVariable int id, @RequestBody Utilisateur utilisateur) {
        try {
            Utilisateur updated = utilisateurService.updateUtilisateur(id, utilisateur);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable int id) {
        utilisateurService.deleteUtilisateur(id);
        return ResponseEntity.noContent().build();
    }


 // Dans UtilisateurController.java

    @PutMapping("/{id}/role")
    public ResponseEntity<Utilisateur> updateRole(@PathVariable int id, @RequestBody Map<String, Integer> payload) {
        try {
            Integer roleId = payload.get("roleId");

            if (roleId == null) {
                return ResponseEntity.badRequest().build();
            }

            // ON UTILISE DIRECTEMENT LA MÉTHODE DU SERVICE DÉDIÉE À CELA
            // Plus besoin de charger l'utilisateur, de set le role manuellement, etc.
            Utilisateur updatedUtilisateur = utilisateurService.addRoleToUtilisateur(id, roleId);

            return ResponseEntity.ok(updatedUtilisateur);

        } catch (RuntimeException e) {
            // Cela capture EntityNotFoundException lancé par le service si l'ID ou le Role n'existe pas
            return ResponseEntity.badRequest().body(null);
        }
    }
}
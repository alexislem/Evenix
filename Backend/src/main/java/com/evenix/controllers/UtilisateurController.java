package com.evenix.controllers;

import com.evenix.dto.UtilisateurDTO;
import com.evenix.services.UtilisateurService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/utilisateur")
@CrossOrigin
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping("/all")
    public ResponseEntity<List<UtilisateurDTO>> getAllUtilisateurs() {
        return ResponseEntity.ok(utilisateurService.getAllUtilisateurs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UtilisateurDTO> getUtilisateurById(@PathVariable int id) {
        try {
            return ResponseEntity.ok(utilisateurService.getUtilisateurById(id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UtilisateurDTO> updateUtilisateur(@PathVariable int id, 
                                                            @RequestBody UtilisateurDTO dto,
                                                            Principal principal) {
        try {
            // --- SÉCURITÉ ---
            // 1. Qui est connecté ?
            String emailConnecte = principal.getName();
            
            // 2. Qui veut-on modifier ?
            UtilisateurDTO targetUser = utilisateurService.getUtilisateurById(id);
            
            // 3. Est-ce un ADMIN ?
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            // 4. VERIFICATION : Si ce n'est pas mon compte ET que je ne suis pas admin => FORBIDDEN
            if (!targetUser.getEmail().equals(emailConnecte) && !isAdmin) {
                return ResponseEntity.status(403).build();
            }
            // ----------------

            UtilisateurDTO updated = utilisateurService.updateUtilisateur(id, dto);
            return ResponseEntity.ok(updated);

        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable int id) {
        // Idéalement, ajouter la même sécurité ici (seul l'admin ou l'user lui-même peut supprimer)
        utilisateurService.deleteUtilisateur(id);
        return ResponseEntity.noContent().build();
    }
}
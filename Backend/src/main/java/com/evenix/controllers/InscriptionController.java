package com.evenix.controllers;

import com.evenix.dto.InscriptionDTO;
import com.evenix.services.InscriptionService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscription")
@CrossOrigin
public class InscriptionController {

    @Autowired
    private InscriptionService inscriptionService;

    @PostMapping
    public ResponseEntity<?> inscrireUtilisateur(@RequestParam int userId, @RequestParam int eventId) {
        try {
            InscriptionDTO dto = inscriptionService.inscrireUtilisateur(userId, eventId);
            return ResponseEntity.ok(dto);
        } catch (IllegalStateException | IllegalArgumentException e) {
            // Renvoie 400 si complet ou déjà inscrit
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> annulerInscription(@PathVariable int id) {
        try {
            inscriptionService.annulerInscription(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<InscriptionDTO>> getByUser(@PathVariable int userId) {
        return ResponseEntity.ok(inscriptionService.getInscriptionsByUtilisateur(userId));
    }
}
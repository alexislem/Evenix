package com.evenix.controllers;

import com.evenix.dto.EvenementDTO;
import com.evenix.services.EvenementService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evenement")
@CrossOrigin
public class EvenementController {

    @Autowired
    private EvenementService evenementService;

    @GetMapping("/all")
    public ResponseEntity<List<EvenementDTO>> getAllEvenements() {
        return ResponseEntity.ok(evenementService.getAllEvenements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvenementDTO> getEvenementById(@PathVariable int id) {
        try {
            return ResponseEntity.ok(evenementService.getEvenementById(id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<EvenementDTO> createEvenement(@RequestBody EvenementDTO dto, @RequestParam int organisateurId) {
        // Note: L'ID organisateur peut aussi être extrait du Token JWT (Principal) pour plus de sécurité
        EvenementDTO created = evenementService.createEvenement(dto, organisateurId);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EvenementDTO> updateEvenement(@PathVariable int id, @RequestBody EvenementDTO dto) {
        try {
            EvenementDTO updated = evenementService.updateEvenement(id, dto);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvenement(@PathVariable int id) {
        try {
            evenementService.deleteEvenement(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Endpoint spécifique pour récupérer les évènements d'un organisateur (utile pour le Dashboard)
    @GetMapping("/organisateur/{orgId}")
    public ResponseEntity<List<EvenementDTO>> getByOrganisateur(@PathVariable int orgId) {
        return ResponseEntity.ok(evenementService.getEvenementsByOrganisateur(orgId));
    }
}
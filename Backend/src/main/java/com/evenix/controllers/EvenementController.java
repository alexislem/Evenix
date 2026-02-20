package com.evenix.controllers;

import com.evenix.dto.EvenementDTO;
import com.evenix.services.EvenementService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/evenements")
public class EvenementController {

    private final EvenementService evenementService;

    public EvenementController(EvenementService evenementService) {
        this.evenementService = evenementService;
    }

    // ✅ Récupérer tous les événements
    @GetMapping
    public ResponseEntity<List<EvenementDTO>> getAllEvenements() {
        return ResponseEntity.ok(evenementService.getAllEvenements());
    }

    // ✅ Récupérer un événement par ID
    @GetMapping("/{id}")
    public ResponseEntity<EvenementDTO> getEvenementById(@PathVariable int id) {
        return ResponseEntity.ok(evenementService.getEvenementById(id));
    }

    // ✅ Créer un événement (organisateurId requis)
    // Exemple: POST /evenements?organisateurId=3
    @PostMapping
    public ResponseEntity<EvenementDTO> createEvenement(
            @RequestBody EvenementDTO dto,
            @RequestParam int organisateurId
    ) {
        EvenementDTO created = evenementService.createEvenement(dto, organisateurId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ✅ Modifier un événement
    @PutMapping("/{id}")
    public ResponseEntity<EvenementDTO> updateEvenement(
            @PathVariable int id,
            @RequestBody EvenementDTO dto
    ) {
        return ResponseEntity.ok(evenementService.updateEvenement(id, dto));
    }

    // ✅ Supprimer un événement
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvenement(@PathVariable int id) {
        evenementService.deleteEvenement(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Récupérer les événements d’un organisateur
    @GetMapping("/organisateur/{organisateurId}")
    public ResponseEntity<List<EvenementDTO>> getEvenementsByOrganisateur(@PathVariable int organisateurId) {
        return ResponseEntity.ok(evenementService.getEvenementsByOrganisateur(organisateurId));
    }

    // ✅ NOUVEAU : Récupérer les événements entre deux dates
    // Exemple:
    // GET /evenements/between-dates?start=2025-11-15T00:00:00&end=2025-12-15T23:59:59
    @GetMapping("/between-dates")
    public ResponseEntity<List<EvenementDTO>> getEvenementsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        return ResponseEntity.ok(evenementService.getEvenementsBetweenDates(start, end));
    }
}

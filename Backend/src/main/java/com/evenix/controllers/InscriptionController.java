package com.evenix.controllers;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.evenix.entities.Inscription;
import com.evenix.services.InscriptionServiceImpl;

@RestController
@RequestMapping("/api/inscription")
public class InscriptionController {

    @Autowired
    private InscriptionServiceImpl inscriptionService;

    @PostMapping
    public ResponseEntity<Inscription> createInscription(@RequestBody Map<String, Object> payload) {
        try {
            int utilisateurId = ((Number) payload.get("utilisateurId")).intValue();
            int evenementId = ((Number) payload.get("evenementId")).intValue();
            ZonedDateTime dateInscription = ZonedDateTime.parse((String) payload.get("dateInscription"));

            Inscription inscription = inscriptionService.createInscription(utilisateurId, evenementId, dateInscription);
            return ResponseEntity.ok(inscription);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Endpoint GET qui retourne la LISTE
    @GetMapping("/utilisateur/{id}")
    public ResponseEntity<List<Inscription>> getInscriptionsByUser(@PathVariable int id) {
        try {
            List<Inscription> inscriptions = inscriptionService.getInscriptionsByUtilisateurId(id);
            return ResponseEntity.ok(inscriptions);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInscription(@PathVariable int id) {
        inscriptionService.deleteInscription(id);
        return ResponseEntity.noContent().build();
    }
}
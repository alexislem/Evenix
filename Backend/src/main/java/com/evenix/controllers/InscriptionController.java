package com.evenix.controllers;

import java.time.ZonedDateTime;
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
            int utilisateurId = (Integer) payload.get("utilisateurId");
            int evenementId = (Integer) payload.get("evenementId");
            ZonedDateTime dateInscription = ZonedDateTime.parse((String) payload.get("dateInscription"));

            Inscription inscription = inscriptionService.createInscription(utilisateurId, evenementId, dateInscription);
            return ResponseEntity.ok(inscription);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}

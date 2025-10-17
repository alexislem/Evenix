package com.evenix.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.evenix.dto.PaiementDTO;
import com.evenix.entities.Paiement;
import com.evenix.services.PaiementServiceImpl;

@RestController
@RequestMapping("/api/paiement")
public class PaiementController {

    private final PaiementServiceImpl paiementService;

    public PaiementController(PaiementServiceImpl paiementService) {
        this.paiementService = paiementService;
    }

    @GetMapping
    public List<Paiement> getAllPaiements() {
        return paiementService.getAllPaiements();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paiement> getPaiementById(@PathVariable int id) {
        return paiementService.getPaiementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Paiement> createPaiement(@RequestBody PaiementDTO dto) {
        Paiement created = paiementService.createPaiement(dto);
        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaiement(@PathVariable int id) {
        paiementService.deletePaiement(id);
        return ResponseEntity.noContent().build();
    }
}

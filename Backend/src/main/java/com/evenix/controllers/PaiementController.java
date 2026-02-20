package com.evenix.controllers;

import com.evenix.dto.PaiementDTO;
import com.evenix.services.PaiementService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/paiement")
@CrossOrigin
public class PaiementController {

    @Autowired
    private PaiementService paiementService;

    @PostMapping("/traiter")
    public ResponseEntity<PaiementDTO> traiterPaiement(@RequestBody PaiementDTO paiementDTO) {
        try {
            PaiementDTO result = paiementService.traiterPaiement(paiementDTO);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaiementDTO> getPaiement(@PathVariable int id) {
        try {
            return ResponseEntity.ok(paiementService.getPaiementById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
package com.evenix.controllers;

import com.evenix.dto.EntrepriseDTO;
import com.evenix.services.EntrepriseService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entreprise")
@CrossOrigin
public class EntrepriseController {

    @Autowired
    private EntrepriseService entrepriseService;

    @GetMapping("/all")
    public ResponseEntity<List<EntrepriseDTO>> getAllEntreprises() {
        return ResponseEntity.ok(entrepriseService.getAllEntreprises());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntrepriseDTO> getEntrepriseById(@PathVariable int id) {
        try {
            return ResponseEntity.ok(entrepriseService.getEntrepriseById(id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<EntrepriseDTO> createEntreprise(@RequestBody EntrepriseDTO dto) {
        return ResponseEntity.ok(entrepriseService.createEntreprise(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntreprise(@PathVariable int id) {
        try {
            entrepriseService.deleteEntreprise(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
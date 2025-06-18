package com.evenix.controllers;

import com.evenix.dto.EvenementDTO;
import com.evenix.services.EvenementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evenement")
public class EvenementController {

    private final EvenementService evenementService;

    public EvenementController(EvenementService evenementService) {
        this.evenementService = evenementService;
    }

    @GetMapping
    public List<EvenementDTO> getAll() {
        return evenementService.getAllEvenements();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvenementDTO> getById(@PathVariable int id) {
        return evenementService.getEvenementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EvenementDTO> create(@RequestBody EvenementDTO dto) {
        return ResponseEntity.ok(evenementService.createEvenement(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EvenementDTO> update(@PathVariable int id, @RequestBody EvenementDTO dto) {
        return ResponseEntity.ok(evenementService.updateEvenement(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        evenementService.deleteEvenement(id);
        return ResponseEntity.noContent().build();
    }
}

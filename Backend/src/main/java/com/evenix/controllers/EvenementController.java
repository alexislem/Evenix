package com.evenix.controllers;

import com.evenix.dto.EvenementDTO;
import com.evenix.entities.Evenement;
import com.evenix.services.EvenementServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evenement")
public class EvenementController {

    private final EvenementServiceImpl evenementService;

    public EvenementController(EvenementServiceImpl evenementService) {
        this.evenementService = evenementService;
    }

    @GetMapping("/all")
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

 // Dans EvenementController.java (exemple)

    @PutMapping("/{id}")
    public ResponseEntity<EvenementDTO> updateEvenement(@PathVariable int id, @RequestBody EvenementDTO dto) {
        try {
            EvenementDTO updated = evenementService.updateEvenement(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            // Gérer EntityNotFoundException ou autre exception si nécessaire
            return ResponseEntity.notFound().build(); 
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        evenementService.deleteEvenement(id);
        return ResponseEntity.noContent().build();
    }
}

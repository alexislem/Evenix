package com.evenix.controllers;

import com.evenix.dto.LieuDTO;
import com.evenix.services.LieuService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lieu")
@CrossOrigin
public class LieuController {

    @Autowired
    private LieuService lieuService;

    @GetMapping("/all")
    public ResponseEntity<List<LieuDTO>> getAllLieux() {
        return ResponseEntity.ok(lieuService.getAllLieux());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LieuDTO> getLieuById(@PathVariable int id) {
        try {
            return ResponseEntity.ok(lieuService.getLieuById(id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<LieuDTO> createLieu(@RequestBody LieuDTO dto) {
        return ResponseEntity.ok(lieuService.createLieu(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LieuDTO> updateLieu(@PathVariable int id, @RequestBody LieuDTO dto) {
        try {
            return ResponseEntity.ok(lieuService.updateLieu(id, dto));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLieu(@PathVariable int id) {
        try {
            lieuService.deleteLieu(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
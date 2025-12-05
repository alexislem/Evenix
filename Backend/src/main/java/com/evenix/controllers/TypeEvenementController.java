package com.evenix.controllers;

import com.evenix.dto.TypeEvenementDTO;
import com.evenix.services.TypeEvenementService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/type-evenement")
@CrossOrigin
public class TypeEvenementController {

    @Autowired
    private TypeEvenementService typeEvenementService;

    @GetMapping("/all")
    public ResponseEntity<List<TypeEvenementDTO>> getAllTypes() {
        return ResponseEntity.ok(typeEvenementService.getAllTypes());
    }

    @PostMapping
    public ResponseEntity<TypeEvenementDTO> createType(@RequestBody TypeEvenementDTO dto) {
        return ResponseEntity.ok(typeEvenementService.createType(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteType(@PathVariable int id) {
        typeEvenementService.deleteType(id);
        return ResponseEntity.noContent().build();
    }
}
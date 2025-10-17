package com.evenix.controllers;

import com.evenix.dto.TypeEvenementDTO;
import com.evenix.services.TypeEvenementServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/typeevenement")
public class TypeEvenementController {

    @Autowired
    private TypeEvenementServiceImpl service;

    @GetMapping
    public List<TypeEvenementDTO> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TypeEvenementDTO> getById(@PathVariable int id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TypeEvenementDTO> create(@RequestBody TypeEvenementDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TypeEvenementDTO> update(@PathVariable int id, @RequestBody TypeEvenementDTO dto) {
        return service.update(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

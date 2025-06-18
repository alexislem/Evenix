package com.evenix.controllers;

import com.evenix.entities.TypeLieu;
import com.evenix.services.TypeLieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/typelieux")
public class TypeLieuController {

    @Autowired
    private TypeLieuService typeLieuService;

    // GET all
    @GetMapping
    public List<TypeLieu> getAllTypes() {
        return typeLieuService.getAllTypes();
    }

    // GET by id
    @GetMapping("/{id}")
    public ResponseEntity<TypeLieu> getTypeById(@PathVariable int id) {
        Optional<TypeLieu> optional = typeLieuService.getTypeById(id);
        return optional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // GET by libelle
    @GetMapping("/libelle/{libelle}")
    public ResponseEntity<TypeLieu> getTypeByLibelle(@PathVariable String libelle) {
        Optional<TypeLieu> optional = typeLieuService.getTypeByLibelle(libelle);
        return optional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // POST create
    @PostMapping
    public ResponseEntity<TypeLieu> createType(@RequestBody TypeLieu typeLieu) {
        TypeLieu saved = typeLieuService.createType(typeLieu);
        return ResponseEntity.ok(saved);
    }

    // PUT update
    @PutMapping("/{id}")
    public ResponseEntity<TypeLieu> updateType(@PathVariable int id, @RequestBody TypeLieu typeLieu) {
        try {
            TypeLieu updated = typeLieuService.updateType(id, typeLieu);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteType(@PathVariable int id) {
        typeLieuService.deleteType(id);
        return ResponseEntity.noContent().build();
    }
}

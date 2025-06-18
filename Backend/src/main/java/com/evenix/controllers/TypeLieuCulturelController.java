package com.evenix.controllers;

import com.evenix.dto.TypeLieuCulturelDTO;
import com.evenix.services.TypeLieuCulturelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/typelieuculturel")
public class TypeLieuCulturelController {

    @Autowired
    private TypeLieuCulturelService service;

    @GetMapping
    public List<TypeLieuCulturelDTO> getAll() {
        return service.getAllTypes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TypeLieuCulturelDTO> getById(@PathVariable int id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TypeLieuCulturelDTO> create(@RequestBody TypeLieuCulturelDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TypeLieuCulturelDTO> update(@PathVariable int id, @RequestBody TypeLieuCulturelDTO dto) {
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

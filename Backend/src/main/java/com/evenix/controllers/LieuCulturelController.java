package com.evenix.controllers;

import com.evenix.dto.LieuCulturelDTO;
import com.evenix.services.LieuCulturelServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lieuculturel")
public class LieuCulturelController {

    @Autowired
    private LieuCulturelServiceImpl service;

    @GetMapping
    public List<LieuCulturelDTO> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LieuCulturelDTO> getById(@PathVariable int id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LieuCulturelDTO> create(@RequestBody LieuCulturelDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LieuCulturelDTO> update(@PathVariable int id, @RequestBody LieuCulturelDTO dto) {
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

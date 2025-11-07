package com.evenix.controllers;

import com.evenix.dto.TypeLieuDTO;
import com.evenix.services.TypeLieuServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/typelieu")
public class TypeLieuController {

    @Autowired
    private TypeLieuServiceImpl typeLieuService;

    @GetMapping
    public List<TypeLieuDTO> getAll() {
        return typeLieuService.getAllTypeLieux();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TypeLieuDTO> getById(@PathVariable int id) {
        return typeLieuService.getTypeLieuById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TypeLieuDTO> create(@RequestBody TypeLieuDTO dto) {
        TypeLieuDTO created = typeLieuService.createTypeLieu(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TypeLieuDTO> update(@PathVariable int id, @RequestBody TypeLieuDTO dto) {
        return typeLieuService.updateTypeLieu(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        return typeLieuService.deleteTypeLieu(id) ?
                ResponseEntity.noContent().build() :
                ResponseEntity.notFound().build();
    }
}

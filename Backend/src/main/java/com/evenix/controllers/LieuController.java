package com.evenix.controllers;

import com.evenix.dto.LieuDTO;
import com.evenix.services.LieuServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lieu")
public class LieuController {

    private final LieuServiceImpl lieuService;

    public LieuController(LieuServiceImpl lieuService) {
        this.lieuService = lieuService;
    }

    @GetMapping("/all")
    public List<LieuDTO> getAllLieux() {
        return lieuService.getAllLieux();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LieuDTO> getLieuById(@PathVariable int id) {
        return lieuService.getLieuById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LieuDTO> createLieu(@RequestBody LieuDTO lieuDTO) {
        return ResponseEntity.ok(lieuService.createLieu(lieuDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LieuDTO> updateLieu(@PathVariable int id,
                                              @RequestBody LieuDTO lieuDTO) {
        return ResponseEntity.ok(lieuService.updateLieu(id, lieuDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLieu(@PathVariable int id) {
        lieuService.deleteLieu(id);
        return ResponseEntity.noContent().build();
    }
}

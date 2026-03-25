package com.evenix.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evenix.entities.Favoris;
import com.evenix.repos.FavorisRepository;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/favoris")
@CrossOrigin
@Tag(name = "Favoris", description ="Point d'accès pour la gestion des favoris")
public class FavorisController {
	
	@Autowired
    private FavorisRepository favorisRepository;

    // Pour voir tous les favoris
    @GetMapping
    public List<Favoris> getAll() {
        return favorisRepository.findAll();
    }

    // Pour ajouter un favori
    @PostMapping
    public Favoris create(@RequestBody Favoris favori) {
        return favorisRepository.save(favori);
    }
}



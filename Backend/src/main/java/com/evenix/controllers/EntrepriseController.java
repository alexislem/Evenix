package com.evenix.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.evenix.entities.Entreprise;
import com.evenix.services.EntrepriseServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/entreprise")
public class EntrepriseController {

	private final EntrepriseServiceImpl entrepriseService;

	public EntrepriseController(EntrepriseServiceImpl entrepriseService) {
	        this.entrepriseService = entrepriseService;
	}

	@GetMapping
	public List<Entreprise> getAllEntreprises() {
		return entrepriseService.getAllEntreprises();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Entreprise> getEntrepriseById(@PathVariable int id) {
		return entrepriseService.getEntrepriseById(id)
				.map(ResponseEntity::ok)
	            .orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public Entreprise createEntreprise(@RequestBody Entreprise entreprise) {
		return entrepriseService.createEntreprise(entreprise);
	}

	@PutMapping("/{id}")
	public Entreprise updateEntreprise(@PathVariable int id, @RequestBody Entreprise updatedEntreprise) {
		return entrepriseService.updateEntreprise(id, updatedEntreprise);
	}

	@DeleteMapping("/{id}")
	public void deleteEntreprise(@PathVariable int id) {
		entrepriseService.deleteEntreprise(id);
	}
}

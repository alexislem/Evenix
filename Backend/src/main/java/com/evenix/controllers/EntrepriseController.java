package com.evenix.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.evenix.dto.EntrepriseDTO; // Utilisé dans le Service
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

	@GetMapping("/all")
	public List<EntrepriseDTO> getAllEntreprises() {
		return entrepriseService.getAllEntreprises();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Entreprise> getEntrepriseById(@PathVariable int id) {
		return entrepriseService.getEntrepriseById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public Entreprise createEntreprise(@RequestBody Entreprise entreprise) {
		return entrepriseService.createEntreprise(entreprise);
	}

	@PutMapping("/{id}") // <-- CIBLE DE LA REQUÊTE FRONTEND
	// ⚠️ Il faut capturer l'Entité et renvoyer l'Entité mise à jour
	public Entreprise updateEntreprise(@PathVariable int id, @RequestBody Entreprise updatedEntreprise) {
        // Le service est responsable de trouver l'Entité existante, la mettre à jour, et la sauvegarder.
		return entrepriseService.updateEntreprise(id, updatedEntreprise);
	}

	@DeleteMapping("/{id}")
	public void deleteEntreprise(@PathVariable int id) {
		entrepriseService.deleteEntreprise(id);
	}
}
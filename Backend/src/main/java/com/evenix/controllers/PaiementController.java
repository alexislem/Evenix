package com.evenix.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.evenix.entities.Paiement;
import com.evenix.services.PaiementService;

@RestController
@RequestMapping("/api/paiement")
public class PaiementController {
	private final PaiementService paiementService;

	public PaiementController(PaiementService paiementService) {
	        this.paiementService = paiementService;
	}

	@GetMapping
	public List<Paiement> getAllPaiements() {
		return paiementService.getAllPaiements();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Paiement> getPaiementById(@PathVariable int id) {
		return paiementService.getPaiementById(id)
				.map(ResponseEntity::ok)
	            .orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public Paiement createPaiement(@RequestBody Paiement paiement) {
		return paiementService.createPaiement(paiement);
	}

	@PutMapping("/{id}")
	public Paiement updatePaiement(@PathVariable int id, @RequestBody Paiement updatedPaiement) {
		return paiementService.updatePaiement(id, updatedPaiement);
	}

	@DeleteMapping("/{id}")
	public void deletePaiement(@PathVariable int id) {
		paiementService.deletePaiement(id);
	}
}




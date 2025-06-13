package com.evenix.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.evenix.entities.Paiement;
import com.evenix.repos.PaiementRepository;

@Service
public class PaiementService {
private PaiementRepository paiementRepository;
	
	public PaiementService(PaiementRepository paiementRepository) {
		this.paiementRepository = paiementRepository;
	}
	
	public List<Paiement> getAllPaiements(){
		return paiementRepository.findAll();
	}
	
	public Optional<Paiement> getPaiementById(int id) {
		return paiementRepository.findById(id);
	}
	
	public Paiement createPaiement(Paiement paiement) {
		return paiementRepository.save(paiement);
	}
	
	public Paiement updatePaiement(int id, Paiement updatedPaiement) {
		return paiementRepository.findById(id)
				.map(e -> {
					e.setCode(updatedPaiement.getCode());
					return paiementRepository.save(e);
				})
				.orElseGet(() -> {
					return paiementRepository.save(updatedPaiement);
				});	
	}
	
	public void deletePaiement(int id) {
		paiementRepository.deleteById(id);		
	}
}




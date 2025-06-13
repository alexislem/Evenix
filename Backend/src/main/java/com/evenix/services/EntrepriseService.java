package com.evenix.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.evenix.entities.Entreprise;
import com.evenix.repos.EntrepriseRepository;

@Service
public class EntrepriseService {
	private EntrepriseRepository entrepriseRepository;
	
	public EntrepriseService(EntrepriseRepository entrepriseRepository) {
		this.entrepriseRepository = entrepriseRepository;
	}
	
	public List<Entreprise> getAllEntreprises(){
		return entrepriseRepository.findAll();
	}
	
	public Optional<Entreprise> getEntrepriseById(int id) {
		return entrepriseRepository.findById(id);
	}
	
	public Entreprise createEntreprise(Entreprise entreprise) {
		return entrepriseRepository.save(entreprise);
	}
	
	public Entreprise updateEntreprise(int id, Entreprise updatedEntreprise) {
		return entrepriseRepository.findById(id)
				.map(e -> {
					e.setNom(updatedEntreprise.getNom());
					return entrepriseRepository.save(e);
				})
				.orElseGet(() -> {
					return entrepriseRepository.save(updatedEntreprise);
				});	
	}
	
	public void deleteEntreprise(int id) {
		entrepriseRepository.deleteById(id);		
	}


}

package com.evenix.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.evenix.dto.EntrepriseDTO;
import com.evenix.dto.EvenementDTO;
import com.evenix.entities.Entreprise;
import com.evenix.repos.EntrepriseRepository;

@Service
public class EntrepriseServiceImpl implements EntrepriseService {

    private final EntrepriseRepository entrepriseRepository;

    public EntrepriseServiceImpl(EntrepriseRepository entrepriseRepository) {
        this.entrepriseRepository = entrepriseRepository;
    }

    @Override
    public List<EntrepriseDTO> getAllEntreprises() {
        return entrepriseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    


    @Override
    public Optional<Entreprise> getEntrepriseById(int id) {
        return entrepriseRepository.findById(id);
    }

    @Override
    public Entreprise createEntreprise(Entreprise entreprise) {
        return entrepriseRepository.save(entreprise);
    }

    @Override
    public Entreprise updateEntreprise(int id, Entreprise updatedEntreprise) {
        return entrepriseRepository.findById(id)
                .map(e -> {
                    e.setNom(updatedEntreprise.getNom());
                    return entrepriseRepository.save(e);
                })
                .orElseGet(() -> entrepriseRepository.save(updatedEntreprise));
    }

    @Override
    public void deleteEntreprise(int id) {
        entrepriseRepository.deleteById(id);
    }
    
    private EntrepriseDTO convertToDTO(Entreprise e) {
        EntrepriseDTO dto = new EntrepriseDTO();
        dto.setId(e.getId());
        dto.setNom(e.getNom());
        dto.setStatutJuridique(e.getStatutJuridique());
        dto.setAdresse(e.getAdresse());
        dto.setSecteurActivite(e.getSecteurActivite());
        dto.setTelephone(e.getTelephone());
        dto.setEmail(e.getEmail());
        return dto;
    }

	public Optional<Entreprise> findByNom(String nom) {
		return entrepriseRepository.findByNom(nom);
	}

	public void save(Entreprise e) {
		// TODO Auto-generated method stub
		entrepriseRepository.save(e);
	}

}




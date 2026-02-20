package com.evenix.services;

import com.evenix.dto.EntrepriseDTO;
import com.evenix.entities.Entreprise;
import com.evenix.repos.EntrepriseRepository;
import com.evenix.services.EntrepriseService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EntrepriseServiceImpl implements EntrepriseService {

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Override
    public List<EntrepriseDTO> getAllEntreprises() {
        return entrepriseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EntrepriseDTO getEntrepriseById(int id) {
        return entrepriseRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Entreprise non trouvée"));
    }

    @Override
    public EntrepriseDTO createEntreprise(EntrepriseDTO dto) {
        Entreprise ent = new Entreprise();
        ent.setNom(dto.getNom());
        ent.setAdresse(dto.getAdresse());
        ent.setEmail(dto.getEmail());
        return convertToDTO(entrepriseRepository.save(ent));
    }

    @Override
    public void deleteEntreprise(int id) {
        entrepriseRepository.deleteById(id);
    }

    private EntrepriseDTO convertToDTO(Entreprise entity) {
        EntrepriseDTO dto = new EntrepriseDTO();
        dto.setId(entity.getId());
        dto.setNom(entity.getNom());
        dto.setAdresse(entity.getAdresse());
        dto.setEmail(entity.getEmail());
        return dto;
    }
}
package com.evenix.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.evenix.entities.Entreprise;
import com.evenix.repos.EntrepriseRepository;

@Service
public class EntrepriseServiceImpl implements EntrepriseService {

    private final EntrepriseRepository entrepriseRepository;

    public EntrepriseServiceImpl(EntrepriseRepository entrepriseRepository) {
        this.entrepriseRepository = entrepriseRepository;
    }

    @Override
    public List<Entreprise> getAllEntreprises() {
        return entrepriseRepository.findAll();
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
}


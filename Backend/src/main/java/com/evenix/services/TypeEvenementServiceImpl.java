package com.evenix.services;

import com.evenix.dto.TypeEvenementDTO;
import com.evenix.entities.TypeEvenement;
import com.evenix.repos.TypeEvenementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TypeEvenementService {

    @Autowired
    private TypeEvenementRepository typeEvenementRepository;

    public List<TypeEvenementDTO> getAll() {
        return typeEvenementRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<TypeEvenementDTO> getById(int id) {
        return typeEvenementRepository.findById(id)
                .map(this::convertToDTO);
    }

    public TypeEvenementDTO create(TypeEvenementDTO dto) {
        TypeEvenement entity = new TypeEvenement(dto.getNom());
        return convertToDTO(typeEvenementRepository.save(entity));
    }

    public Optional<TypeEvenementDTO> update(int id, TypeEvenementDTO dto) {
        return typeEvenementRepository.findById(id).map(existing -> {
            existing.setNom(dto.getNom());
            return convertToDTO(typeEvenementRepository.save(existing));
        });
    }

    public void delete(int id) {
        typeEvenementRepository.deleteById(id);
    }

    private TypeEvenementDTO convertToDTO(TypeEvenement entity) {
        TypeEvenementDTO dto = new TypeEvenementDTO();
        dto.setId(entity.getId());
        dto.setNom(entity.getNom());
        return dto;
    }
}

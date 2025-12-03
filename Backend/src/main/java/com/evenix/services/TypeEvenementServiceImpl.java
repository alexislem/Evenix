package com.evenix.services;

import com.evenix.dto.TypeEvenementDTO;
import com.evenix.entities.TypeEvenement;
import com.evenix.repos.TypeEvenementRepository;
import com.evenix.services.TypeEvenementService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TypeEvenementServiceImpl implements TypeEvenementService {

    @Autowired
    private TypeEvenementRepository typeEvenementRepository;

    @Override
    public List<TypeEvenementDTO> getAllTypes() {
        return typeEvenementRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TypeEvenementDTO getTypeById(int id) {
        return typeEvenementRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Type d'événement non trouvé avec l'id : " + id));
    }

    @Override
    public TypeEvenementDTO createType(TypeEvenementDTO dto) {
        TypeEvenement type = new TypeEvenement();
        type.setNom(dto.getNom());
        return convertToDTO(typeEvenementRepository.save(type));
    }

    @Override
    public void deleteType(int id) {
        typeEvenementRepository.deleteById(id);
    }

    private TypeEvenementDTO convertToDTO(TypeEvenement entity) {
        return new TypeEvenementDTO(entity.getId(), entity.getNom());
    }
}
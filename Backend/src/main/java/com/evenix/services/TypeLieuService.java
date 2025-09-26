package com.evenix.services;

import com.evenix.dto.TypeLieuDTO;
import com.evenix.entities.TypeLieu;
import com.evenix.repos.TypeLieuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TypeLieuService {

    @Autowired
    private TypeLieuRepository typeLieuRepository;

    // Convert entity to DTO
    private TypeLieuDTO toDTO(TypeLieu typeLieu) {
        return new TypeLieuDTO(typeLieu.getId(), typeLieu.getLibelle());
    }

    // Convert DTO to entity
    private TypeLieu toEntity(TypeLieuDTO dto) {
        return new TypeLieu(dto.getLibelle());
    }

    public List<TypeLieuDTO> getAllTypeLieux() {
        return typeLieuRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<TypeLieuDTO> getTypeLieuById(int id) {
        return typeLieuRepository.findById(id).map(this::toDTO);
    }

    public TypeLieuDTO createTypeLieu(TypeLieuDTO dto) {
        TypeLieu typeLieu = toEntity(dto);
        TypeLieu saved = typeLieuRepository.save(typeLieu);
        return toDTO(saved);
    }

    public Optional<TypeLieuDTO> updateTypeLieu(int id, TypeLieuDTO dto) {
        return typeLieuRepository.findById(id).map(existing -> {
            existing.setLibelle(dto.getLibelle());
            return toDTO(typeLieuRepository.save(existing));
        });
    }

    public boolean deleteTypeLieu(int id) {
        if (typeLieuRepository.existsById(id)) {
            typeLieuRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

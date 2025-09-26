package com.evenix.services;

import com.evenix.dto.TypeLieuDTO;
import com.evenix.entities.TypeLieu;
import com.evenix.repos.TypeLieuRepository;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TypeLieuServiceImpl implements TypeLieuService {

    private final TypeLieuRepository typeLieuRepository;

    public TypeLieuServiceImpl(TypeLieuRepository typeLieuRepository) {
        this.typeLieuRepository = typeLieuRepository;
    }

    // --------- Conversions ---------
    private TypeLieuDTO toDTO(TypeLieu typeLieu) {
        return new TypeLieuDTO(typeLieu.getId(), typeLieu.getLibelle());
    }

    private TypeLieu toEntity(TypeLieuDTO dto) {
        return new TypeLieu(dto.getLibelle());
    }

    // --------- Implémentation ---------
    
    @Override
    public List<TypeLieuDTO> getAllTypeLieux() {
        return typeLieuRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<TypeLieuDTO> getTypeLieuById(int id) {
        return typeLieuRepository.findById(id).map(this::toDTO);
    }

    @Override
    public TypeLieuDTO createTypeLieu(TypeLieuDTO dto) {
        TypeLieu typeLieu = toEntity(dto);
        TypeLieu saved = typeLieuRepository.save(typeLieu);
        return toDTO(saved);
    }

    @Override
    public Optional<TypeLieuDTO> updateTypeLieu(int id, TypeLieuDTO dto) {
        return typeLieuRepository.findById(id).map(existing -> {
            existing.setLibelle(dto.getLibelle());
            return toDTO(typeLieuRepository.save(existing));
        });
    }

    @Override
    public boolean deleteTypeLieu(int id) {
        if (typeLieuRepository.existsById(id)) {
            typeLieuRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

package com.evenix.services;

import com.evenix.dto.TypeLieuCulturelDTO;
import com.evenix.entities.TypeLieuCulturel;
import com.evenix.repos.TypeLieuCulturelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TypeLieuCulturelServiceImpl implements TypeLieuCulturelService{

    @Autowired
    private TypeLieuCulturelRepository typeLieuCulturelRepository;

    @Override
    public List<TypeLieuCulturelDTO> getAllTypes() {
        return typeLieuCulturelRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<TypeLieuCulturelDTO> getById(int id) {
        return typeLieuCulturelRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public TypeLieuCulturelDTO create(TypeLieuCulturelDTO dto) {
        TypeLieuCulturel entity = new TypeLieuCulturel(dto.getNom());
        return convertToDTO(typeLieuCulturelRepository.save(entity));
    }

    @Override
    public Optional<TypeLieuCulturelDTO> update(int id, TypeLieuCulturelDTO dto) {
        return typeLieuCulturelRepository.findById(id).map(existing -> {
            existing.setNom(dto.getNom());
            return convertToDTO(typeLieuCulturelRepository.save(existing));
        });
    }

    @Override
    public void delete(int id) {
        typeLieuCulturelRepository.deleteById(id);
    }

    
    private TypeLieuCulturelDTO convertToDTO(TypeLieuCulturel entity) {
        TypeLieuCulturelDTO dto = new TypeLieuCulturelDTO();
        dto.setId(entity.getId());
        dto.setNom(entity.getNom());
        return dto;
    }
}

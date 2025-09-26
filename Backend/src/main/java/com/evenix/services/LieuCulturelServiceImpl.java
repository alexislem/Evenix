package com.evenix.services;

import com.evenix.dto.LieuCulturelDTO;
import com.evenix.dto.TypeLieuCulturelDTO;
import com.evenix.entities.LieuCulturel;
import com.evenix.entities.TypeLieuCulturel;
import com.evenix.repos.LieuCulturelRepository;
import com.evenix.repos.TypeLieuCulturelRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LieuCulturelServiceImpl implements LieuCulturelService{

    @Autowired
    private LieuCulturelRepository lieuCulturelRepository;

    @Autowired
    private TypeLieuCulturelRepository typeLieuCulturelRepository;
    
    @Override
    public List<LieuCulturelDTO> getAll() {
        return lieuCulturelRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<LieuCulturelDTO> getById(int id) {
        return lieuCulturelRepository.findById(id).map(this::toDTO);
    }

    @Override
    public LieuCulturelDTO create(LieuCulturelDTO dto) {
        LieuCulturel lieu = fromDTO(dto);
        return toDTO(lieuCulturelRepository.save(lieu));
    }

    @Override
    public Optional<LieuCulturelDTO> update(int id, LieuCulturelDTO dto) {
        return lieuCulturelRepository.findById(id).map(existing -> {
            existing.setNom(dto.getNom());
            existing.setLatitude(dto.getLatitude());
            existing.setLongitude(dto.getLongitude());

            if (dto.getTypeLieuCulturel() != null) {
                typeLieuCulturelRepository.findById(dto.getTypeLieuCulturel().getId())
                    .ifPresent(existing::setTypeLieuCulturel);
            }

            return toDTO(lieuCulturelRepository.save(existing));
        });
    }

    @Override
    public void delete(int id) {
        lieuCulturelRepository.deleteById(id);
    }

    // Conversion
    private LieuCulturelDTO toDTO(LieuCulturel lieu) {
        LieuCulturelDTO dto = new LieuCulturelDTO();
        dto.setId(lieu.getId());
        dto.setNom(lieu.getNom());
        dto.setLatitude(lieu.getLatitude());
        dto.setLongitude(lieu.getLongitude());

        if (lieu.getTypeLieuCulturel() != null) {
            TypeLieuCulturelDTO typeDTO = new TypeLieuCulturelDTO();
            typeDTO.setId(lieu.getTypeLieuCulturel().getId());
            typeDTO.setNom(lieu.getTypeLieuCulturel().getNom());
            dto.setTypeLieuCulturel(typeDTO);
        }

        return dto;
    }

    private LieuCulturel fromDTO(LieuCulturelDTO dto) {
        TypeLieuCulturel type = typeLieuCulturelRepository.findById(dto.getTypeLieuCulturel().getId())
                .orElseThrow(() -> new IllegalArgumentException("TypeLieuCulturel introuvable"));

        LieuCulturel lieu = new LieuCulturel(
                dto.getNom(),
                dto.getLatitude(),
                dto.getLongitude(),
                type
        );
        return lieu;
    }
}

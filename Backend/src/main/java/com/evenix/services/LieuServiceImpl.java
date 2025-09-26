package com.evenix.services;

import com.evenix.dto.LieuDTO;
import com.evenix.entities.Lieu;
import com.evenix.repos.LieuRepository;
import com.evenix.repos.TypeLieuRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LieuService {

    private final LieuRepository lieuRepository;
    private final TypeLieuRepository typeLieuRepository;

    public LieuService(LieuRepository lieuRepository, TypeLieuRepository typeLieuRepository) {
        this.lieuRepository = lieuRepository;
        this.typeLieuRepository = typeLieuRepository;
    }

    public List<LieuDTO> getAllLieux() {
        return lieuRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Optional<LieuDTO> getLieuById(int id) {
        return lieuRepository.findById(id).map(this::convertToDTO);
    }

    public LieuDTO createLieu(LieuDTO dto) {
        Lieu lieu = convertToEntity(dto);
        return convertToDTO(lieuRepository.save(lieu));
    }

    public LieuDTO updateLieu(int id, LieuDTO dto) {
        return lieuRepository.findById(id)
                .map(existing -> {
                    existing.setNom(dto.getNom());
                    existing.setAdresse(dto.getAdresse());
                    existing.setLatitude(dto.getLatitude());
                    existing.setLongitude(dto.getLongitude());
                    existing.setNbPlaces(dto.getNbPlaces());
                    if (dto.getTypeLieu() != null) {
                        typeLieuRepository.findById(dto.getTypeLieu().getId()).ifPresent(existing::setTypeLieu);
                    }
                    return convertToDTO(lieuRepository.save(existing));
                })
                .orElseGet(() -> createLieu(dto));
    }

    public void deleteLieu(int id) {
        lieuRepository.deleteById(id);
    }

    // Conversion helpers

    private LieuDTO convertToDTO(Lieu lieu) {
        LieuDTO dto = new LieuDTO();
        dto.setId(lieu.getId());
        dto.setNom(lieu.getNom());
        dto.setAdresse(lieu.getAdresse());
        dto.setLatitude(lieu.getLatitude());
        dto.setLongitude(lieu.getLongitude());
        dto.setNbPlaces(lieu.getNbPlaces());

        if (lieu.getTypeLieu() != null) {
            var typeDTO = new com.evenix.dto.TypeLieuDTO();
            typeDTO.setId(lieu.getTypeLieu().getId());
            typeDTO.setLibelle(lieu.getTypeLieu().getLibelle());
            dto.setTypeLieu(typeDTO);
        }

        return dto;
    }

    private Lieu convertToEntity(LieuDTO dto) {
        Lieu lieu = new Lieu();
        lieu.setNom(dto.getNom());
        lieu.setAdresse(dto.getAdresse());
        lieu.setLatitude(dto.getLatitude());
        lieu.setLongitude(dto.getLongitude());
        lieu.setNbPlaces(dto.getNbPlaces());

        if (dto.getTypeLieu() != null) {
            typeLieuRepository.findById(dto.getTypeLieu().getId()).ifPresent(lieu::setTypeLieu);
        }

        return lieu;
    }
}

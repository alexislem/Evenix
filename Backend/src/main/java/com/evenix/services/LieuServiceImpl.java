package com.evenix.services;

import com.evenix.dto.LieuDTO;
import com.evenix.entities.Lieu;
import com.evenix.repos.LieuRepository;
import com.evenix.services.LieuService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class LieuServiceImpl implements LieuService {

    @Autowired
    private LieuRepository lieuRepository;

    @Override
    public List<LieuDTO> getAllLieux() {
        return lieuRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public LieuDTO getLieuById(int id) {
        return lieuRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Lieu non trouvé"));
    }

    // --- IMPLÉMENTATION DE LA MÉTHODE MANQUANTE ---
    @Override
    public Lieu getLieuEntityById(int id) {
        return lieuRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lieu non trouvé avec l'id : " + id));
    }
    // ----------------------------------------------

    @Override
    public LieuDTO createLieu(LieuDTO dto) {
        Lieu lieu = null;

        // Dédoublonnage via Google Place ID
        if (dto.getGooglePlaceId() != null && !dto.getGooglePlaceId().isEmpty()) {
            Optional<Lieu> existing = lieuRepository.findByGooglePlaceId(dto.getGooglePlaceId());
            if (existing.isPresent()) {
                // Si le lieu existe déjà, on le retourne
                return convertToDTO(existing.get());
            }
        }

        // Sinon création
        lieu = new Lieu();
        updateEntityFromDTO(lieu, dto);
        
        return convertToDTO(lieuRepository.save(lieu));
    }

    @Override
    public LieuDTO updateLieu(int id, LieuDTO dto) {
        return lieuRepository.findById(id).map(lieu -> {
            updateEntityFromDTO(lieu, dto);
            return convertToDTO(lieuRepository.save(lieu));
        }).orElseThrow(() -> new EntityNotFoundException("Lieu non trouvé"));
    }

    @Override
    public void deleteLieu(int id) {
        lieuRepository.deleteById(id);
    }

    // --- Helpers ---

    private void updateEntityFromDTO(Lieu lieu, LieuDTO dto) {
        lieu.setNom(dto.getNom());
        lieu.setAdresse(dto.getAdresse());
        lieu.setVille(dto.getVille());
        lieu.setCodePostal(dto.getCodePostal());
        lieu.setLatitude(dto.getLatitude());
        lieu.setLongitude(dto.getLongitude());
        lieu.setTypeLieu(dto.getTypeLieu());
        lieu.setGooglePlaceId(dto.getGooglePlaceId());
        lieu.setCapaciteMax(dto.getCapaciteMax());
    }

    private LieuDTO convertToDTO(Lieu entity) {
        LieuDTO dto = new LieuDTO();
        dto.setId(entity.getId());
        dto.setNom(entity.getNom());
        dto.setAdresse(entity.getAdresse());
        dto.setVille(entity.getVille());
        dto.setCodePostal(entity.getCodePostal());
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        dto.setTypeLieu(entity.getTypeLieu());
        dto.setGooglePlaceId(entity.getGooglePlaceId());
        dto.setCapaciteMax(entity.getCapaciteMax());
        return dto;
    }
}
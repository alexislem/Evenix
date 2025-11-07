package com.evenix.services;

import com.evenix.dto.EvenementDTO;
import com.evenix.dto.LieuDTO;
import com.evenix.dto.UtilisateurDTO;
import com.evenix.entities.Evenement;
import com.evenix.entities.Lieu;
import com.evenix.entities.Utilisateur;
import com.evenix.repos.EvenementRepository;
import com.evenix.repos.LieuRepository;
import com.evenix.repos.UtilisateurRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EvenementServiceImpl implements EvenementService{

    private final EvenementRepository evenementRepository;
    private final LieuRepository lieuRepository;
    private final UtilisateurRepository utilisateurRepository;

    public EvenementServiceImpl(EvenementRepository evenementRepository, LieuRepository lieuRepository, UtilisateurRepository utilisateurRepository) {
        this.evenementRepository = evenementRepository;
        this.lieuRepository = lieuRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public List<EvenementDTO> getAllEvenements() {
        return evenementRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<EvenementDTO> getEvenementById(int id) {
        return evenementRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    public EvenementDTO createEvenement(EvenementDTO dto) {
        Evenement evenement = convertToEntity(dto);
        return convertToDTO(evenementRepository.save(evenement));
    }

    @Override
    public EvenementDTO updateEvenement(int id, EvenementDTO dto) {
        return evenementRepository.findById(id)
                .map(existing -> {
                    existing.setNom(dto.getNom());
                    existing.setDateDebut(dto.getDateDebut());
                    existing.setDateFin(dto.getDateFin());
                    existing.setPayant(dto.getPayant());
                    existing.setDescription(dto.getDescription());
                    existing.setPrix(dto.getPrix());

                    if (dto.getLieu() != null) {
                        lieuRepository.findById(dto.getLieu().getId()).ifPresent(existing::setLieu);
                    }
                    if (dto.getUtilisateur() != null) {
                        utilisateurRepository.findById(dto.getUtilisateur().getId()).ifPresent(existing::setUtilisateur);
                    }

                    return convertToDTO(evenementRepository.save(existing));
                })
                .orElseGet(() -> createEvenement(dto));
    }

    @Override
    public void deleteEvenement(int id) {
        evenementRepository.deleteById(id);
    }

    // Conversion helpers


    private EvenementDTO convertToDTO(Evenement e) {
        EvenementDTO dto = new EvenementDTO();
        dto.setId(e.getId());
        dto.setNom(e.getNom());
        dto.setDateDebut(e.getDateDebut());
        dto.setDateFin(e.getDateFin());
        dto.setPayant(e.getPayant());
        dto.setDescription(e.getDescription());
        dto.setPrix(e.getPrix());

        if (e.getLieu() != null) {
            LieuDTO lieuDTO = new LieuDTO();
            lieuDTO.setId(e.getLieu().getId());
            lieuDTO.setNom(e.getLieu().getNom());
            dto.setLieu(lieuDTO);
        }

        if (e.getUtilisateur() != null) {
            UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
            utilisateurDTO.setId(e.getUtilisateur().getId());
            utilisateurDTO.setNom(e.getUtilisateur().getNom());
            dto.setUtilisateur(utilisateurDTO);
        }

        return dto;
    }


    private Evenement convertToEntity(EvenementDTO dto) {
        Evenement e = new Evenement();
        e.setNom(dto.getNom());
        e.setDateDebut(dto.getDateDebut());
        e.setDateFin(dto.getDateFin());
        e.setPayant(dto.getPayant());
        e.setDescription(dto.getDescription());
        e.setPrix(dto.getPrix());

        if (dto.getLieu() != null) {
            lieuRepository.findById(dto.getLieu().getId()).ifPresent(e::setLieu);
        }

        if (dto.getUtilisateur() != null) {
            utilisateurRepository.findById(dto.getUtilisateur().getId()).ifPresent(e::setUtilisateur);
        }

        return e;
    }
}

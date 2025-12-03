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

import jakarta.transaction.Transactional;

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
	public List<EvenementDTO> getEvenementParVille(String ville) {
		// TODO Auto-generated method stub
		List<EvenementDTO> listEvenement = this.getAllEvenements();
		
		return null;
	}
    
    public Optional<Evenement> findByNom(String nom) {
        return evenementRepository.findByNom(nom);
    }
    
    public Evenement save(Evenement evenement){
    	return evenementRepository.save(evenement);
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

 // Dans EvenementServiceImpl.java

    @Override
    @Transactional // Assurez la persistance des deux entités
    public EvenementDTO updateEvenement(int id, EvenementDTO dto) {
        return evenementRepository.findById(id)
                .map(existing -> {
                    // Mise à jour des champs de l'événement
                    existing.setNom(dto.getNom());
                    existing.setDateDebut(dto.getDateDebut());
                    existing.setDateFin(dto.getDateFin());
                    existing.setPayant(dto.getPayant());
                    existing.setDescription(dto.getDescription());
                    existing.setPrix(dto.getPrix());

                    // ⚠️ La ville est un attribut direct de Evenement (d'après votre Entité Evenement.java)
                    existing.setVille(dto.getVille()); 

                    // 2. Gestion du Lieu (si l'ID n'a pas changé, on modifie les propriétés du Lieu)
                    if (dto.getLieu() != null) {
                        lieuRepository.findById(dto.getLieu().getId()).ifPresent(lieu -> {
                            
                            // Si le nombre de places change, on met à jour l'entité Lieu
                            if (lieu.getNbPlaces() != dto.getLieu().getNbPlaces()) {
                                 lieu.setNbPlaces(dto.getLieu().getNbPlaces());
                                 
                                 // ⚠️ SAUVEGARDE DU LIEU : L'entité Lieu doit être sauvegardée séparément 
                                 // pour que la modification soit effective.
                                 lieuRepository.save(lieu); 
                            }
                            
                            // Vous pourriez aussi vouloir mettre à jour la ville du Lieu si elle n'est pas gérée par Evenement
                            if (lieu.getVille() != null && !lieu.getVille().equals(dto.getLieu().getVille())) {
                                 // Si vous décidez de lier la modification de Ville dans le front au Lieu
                                 // lieu.setVille(dto.getLieu().getVille());
                                 // lieuRepository.save(lieu);
                            }
                            
                            existing.setLieu(lieu);
                        });
                    }
                    
                    // 3. Gestion de l'Organisateur
                    if (dto.getUtilisateur() != null) {
                        utilisateurRepository.findById(dto.getUtilisateur().getId()).ifPresent(existing::setUtilisateur);
                    }
                    
                    // 4. Sauvegarde de l'événement (qui force la mise à jour des relations)
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
        
        // ⚠️ Remplissage du champ Ville direct de l'événement (pour l'affichage MapPin)
        dto.setVille(e.getVille()); 

        if (e.getLieu() != null) {
            LieuDTO lieuDTO = new LieuDTO();
            lieuDTO.setId(e.getLieu().getId());
            lieuDTO.setNom(e.getLieu().getNom());
            
            // ⚠️ AJOUT CRITIQUE : Mappage des champs modifiés de l'entité Lieu
            lieuDTO.setNbPlaces(e.getLieu().getNbPlaces());
            // Si la ville du Lieu est importante :
            lieuDTO.setVille(e.getLieu().getVille()); 

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

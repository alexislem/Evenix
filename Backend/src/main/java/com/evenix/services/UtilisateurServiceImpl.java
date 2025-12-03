package com.evenix.services;

import com.evenix.entities.Entreprise;
import com.evenix.entities.Role;
import com.evenix.entities.Utilisateur;
import com.evenix.exception.EmailAlreadyExistsException;
import com.evenix.repos.EntrepriseRepository;
import com.evenix.repos.RoleRepository;
import com.evenix.repos.UtilisateurRepository;
import com.evenix.dto.EntrepriseDTO;
import com.evenix.dto.UtilisateurDTO;
import com.evenix.dto.request.RegistrationRequest;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UtilisateurServiceImpl implements UtilisateurService{

    @Autowired
    private UtilisateurRepository utilisateurRepository;
    

    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPassWordEncoder;


    @Override
    public List<UtilisateurDTO> getAllUtilisateurs() {
        return utilisateurRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Utilisateur> getUtilisateurById(int id) {

        return utilisateurRepository.findById(id);
    }

    @Override
    public Optional<Utilisateur> findUtilisateurByNom(String utilisateurNom) {
        return utilisateurRepository.findByNom(utilisateurNom);
    }
    
    @Override
    public Optional<Utilisateur> findUtilisateurByEmail(String utilisateurEmail) {
        return utilisateurRepository.findByEmail(utilisateurEmail);
    }

    @Override
    public Utilisateur createUtilisateur(Utilisateur utilisateur) {

        if (utilisateur.getEmail() != null && utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            throw new IllegalArgumentException("Email déjà utilisé : " + utilisateur.getEmail());
        }
        if (utilisateur.getMotDePasse() != null && !utilisateur.getMotDePasse().isBlank()) {
            utilisateur.setMotDePasse(bCryptPassWordEncoder.encode(utilisateur.getMotDePasse()));
        }
        return utilisateurRepository.save(utilisateur);
    }

    @Override
    public Utilisateur saveUtilisateur(Utilisateur utilisateur) {
        if (utilisateur.getMotDePasse() != null && !utilisateur.getMotDePasse().isBlank()) {
            utilisateur.setMotDePasse(bCryptPassWordEncoder.encode(utilisateur.getMotDePasse()));
        }
        return utilisateurRepository.save(utilisateur);
    }

    @Override
    @Transactional // <--- Assure que tout se passe dans une transaction
    public Utilisateur updateUtilisateur(int id, Utilisateur utilisateurDetails) {
        return utilisateurRepository.findById(id)
                .map(utilisateur -> {
                    // 1. Mise à jour des champs simples
                    utilisateur.setNom(utilisateurDetails.getNom());
                    utilisateur.setPrenom(utilisateurDetails.getPrenom());
                    utilisateur.setEmail(utilisateurDetails.getEmail());
                    utilisateur.setTelephone(utilisateurDetails.getTelephone());
                    utilisateur.setDateDeNaissance(utilisateurDetails.getDateDeNaissance());
                    
                    // Gestion du mot de passe uniquement s'il est fourni
                    if (utilisateurDetails.getMotDePasse() != null && !utilisateurDetails.getMotDePasse().isBlank()) {
                        utilisateur.setMotDePasse(bCryptPassWordEncoder.encode(utilisateurDetails.getMotDePasse()));
                    }

                    // 2. Gestion ROBUSTE du Rôle
                    // Le JSON envoie un objet partiel {id: 1}, on doit récupérer le vrai Role en base
                    if (utilisateurDetails.getRole() != null) {
                        Role realRole = roleRepository.findById(utilisateurDetails.getRole().getId())
                                .orElseThrow(() -> new EntityNotFoundException("Rôle introuvable"));
                        utilisateur.setRole(realRole);
                    }

                    // 3. Gestion ROBUSTE de l'Entreprise
                    // Le JSON envoie {id: 5} ou null. On récupère la vraie Entreprise.
                    if (utilisateurDetails.getEntreprise() != null) {
                        Entreprise realEntreprise = entrepriseRepository.findById(utilisateurDetails.getEntreprise().getId())
                                .orElseThrow(() -> new EntityNotFoundException("Entreprise introuvable"));
                        utilisateur.setEntreprise(realEntreprise);
                    } else {
                        // Si le front envoie null, on détache l'utilisateur de l'entreprise
                        utilisateur.setEntreprise(null);
                    }

                    // 4. Mise à jour de la date de modif
                    utilisateur.setDateModif(LocalDate.now());

                    // 5. Force l'écriture immédiate en base
                    return utilisateurRepository.saveAndFlush(utilisateur);
                })
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'id : " + id));
    }

    @Override
    public void deleteUtilisateur(int id) {
        utilisateurRepository.deleteById(id);
    }


    @Override
    public Utilisateur addRoleToUtilisateur(String utilisateurNom, String roleNom) {
        Utilisateur usr = utilisateurRepository.findByNom(utilisateurNom)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable : " + utilisateurNom));

        Role role = roleRepository.findByNom(roleNom)
                .orElseThrow(() -> new EntityNotFoundException("Rôle introuvable : " + roleNom));

        usr.setRole(role); // ManyToOne
        usr.setDateModif(LocalDate.now());
        return utilisateurRepository.save(usr);
    }


    @Override
    public Utilisateur addRoleToUtilisateur(Optional<Utilisateur> utilisateurOpt, Optional<Role> roleOpt) {
        Utilisateur usr = utilisateurOpt
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable (Optional vide)"));

        Role role = roleOpt
                .orElseThrow(() -> new EntityNotFoundException("Rôle introuvable (Optional vide)"));

        usr.setRole(role);
        return utilisateurRepository.save(usr);
    }


 // Dans UtilisateurServiceImpl.java

    @Override
    public Utilisateur addRoleToUtilisateur(int utilisateurId, int roleId) {
        Utilisateur usr = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable id=" + utilisateurId));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new EntityNotFoundException("Rôle introuvable id=" + roleId));

        usr.setRole(role);
        
        // AJOUT : Mettre à jour la date de modification pour la traçabilité
        usr.setDateModif(LocalDate.now()); 
        
        return utilisateurRepository.save(usr);
    }
    
    /*@Override
    public Utilisateur registerUtilisateur(RegistrationRequest request) {

        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email déjà existant !");
        }


        Utilisateur newUtilisateur = new Utilisateur();
        newUtilisateur.setNom(request.getUsername());               
        newUtilisateur.setEmail(request.getEmail());
        newUtilisateur.setMotDePasse(bCryptPassWordEncoder.encode(request.getPassword()));


        Role roleUser = roleRepository.findByNom("UTILISATEUR")
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Rôle UTILISATEUR introuvable"));
        newUtilisateur.setRole(roleUser); 
        

        return utilisateurRepository.save(newUtilisateur);
    }*/
    
    @Override
    public int getNombresUtilisateurs() {
    	return utilisateurRepository.findAll().size();
    }
    
 // 🔹 Mapping Entity → DTO
 // 🔹 Mapping Entity → DTO
    private UtilisateurDTO convertToDTO(Utilisateur utilisateur) {
        UtilisateurDTO dto = new UtilisateurDTO();
        dto.setId(utilisateur.getId());
        dto.setNom(utilisateur.getNom());
        dto.setPrenom(utilisateur.getPrenom());
        dto.setEmail(utilisateur.getEmail());
        dto.setTelephone(utilisateur.getTelephone());
        dto.setDateDeNaissance(utilisateur.getDateDeNaissance()); // Pensez à l'ajouter si besoin
        dto.setRole(utilisateur.getRole());

        if (utilisateur.getEntreprise() != null) {
            // Il faut convertir l'entité Entreprise en EntrepriseDTO
            // car votre UtilisateurDTO attend un EntrepriseDTO
            EntrepriseDTO entDto = new EntrepriseDTO();
            entDto.setId(utilisateur.getEntreprise().getId());
            entDto.setNom(utilisateur.getEntreprise().getNom());
            entDto.setAdresse(utilisateur.getEntreprise().getAdresse());
            entDto.setEmail(utilisateur.getEntreprise().getEmail());
            // Ajoutez d'autres champs si nécessaire
            
            dto.setEntreprise(entDto);
        }
        // ------------------------------------------------------------

        return dto;
    }
    }


    


package com.evenix.services;

import com.evenix.entities.Role;
import com.evenix.entities.Utilisateur;
import com.evenix.exception.EmailAlreadyExistsException;
import com.evenix.repos.RoleRepository;
import com.evenix.repos.UtilisateurRepository;
import com.evenix.dto.request.RegistrationRequest;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurServiceImpl implements UtilisateurService{

    @Autowired
    private UtilisateurRepository utilisateurRepository;
    

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPassWordEncoder;


    @Override
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
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
    public Utilisateur updateUtilisateur(int id, Utilisateur utilisateurDetails) {
        return utilisateurRepository.findById(id)
                .map(utilisateur -> {
                    utilisateur.setNom(utilisateurDetails.getNom());
                    utilisateur.setPrenom(utilisateurDetails.getPrenom());
                    utilisateur.setDateDeNaissance(utilisateurDetails.getDateDeNaissance());

                    if (utilisateurDetails.getMotDePasse() != null && !utilisateurDetails.getMotDePasse().isBlank()) {
                        utilisateur.setMotDePasse(bCryptPassWordEncoder.encode(utilisateurDetails.getMotDePasse()));
                    }
                    utilisateur.setEmail(utilisateurDetails.getEmail());
                    utilisateur.setEntreprise(utilisateurDetails.getEntreprise());
                    utilisateur.setRole(utilisateurDetails.getRole());
                    utilisateur.setDateModif(LocalDate.now());
                    return utilisateurRepository.save(utilisateur);
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


    @Override
    public Utilisateur addRoleToUtilisateur(int utilisateurId, int roleId) {
        Utilisateur usr = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable id=" + utilisateurId));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new EntityNotFoundException("Rôle introuvable id=" + roleId));

        usr.setRole(role);
        return utilisateurRepository.save(usr);
    }
    
    @Override
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
    }
    
    @Override
    public int getNombresUtilisateurs() {
    	return utilisateurRepository.findAll().size();
    }
    }


    


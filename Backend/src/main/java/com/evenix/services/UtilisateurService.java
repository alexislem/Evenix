package com.evenix.services;

import com.evenix.entities.Utilisateur;
import com.evenix.repos.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    public Optional<Utilisateur> getUtilisateurById(int id) {
        return utilisateurRepository.findById(id);
    }

    public Utilisateur createUtilisateur(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    public Utilisateur updateUtilisateur(int id, Utilisateur utilisateurDetails) {
        return utilisateurRepository.findById(id).map(utilisateur -> {
            utilisateur.setNom(utilisateurDetails.getNom());
            utilisateur.setPrenom(utilisateurDetails.getPrenom());
            utilisateur.setDatedenaissance(utilisateurDetails.getDatedenaissance());
            utilisateur.setMotdepasse(utilisateurDetails.getMotdepasse());
            utilisateur.setEmail(utilisateurDetails.getEmail());
            utilisateur.setEntreprise(utilisateurDetails.getEntreprise());
            utilisateur.setRole(utilisateurDetails.getRole());
            return utilisateurRepository.save(utilisateur);
        }).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'id : " + id));
    }

    public void deleteUtilisateur(int id) {
        utilisateurRepository.deleteById(id);
    }
}

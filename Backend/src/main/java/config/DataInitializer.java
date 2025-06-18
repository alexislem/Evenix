package com.evenix.config;

import com.evenix.entities.Entreprise;
import com.evenix.entities.Role;
import com.evenix.entities.Utilisateur;
import com.evenix.repos.EntrepriseRepository;
import com.evenix.repos.RoleRepository;
import com.evenix.repos.UtilisateurRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            Role admin = new Role();
            admin.setNom("ADMIN");

            Role user = new Role();
            user.setNom("UTILISATEUR");

            roleRepository.saveAll(List.of(admin, user));
            System.out.println("[DataInit] Rôles créés.");
        }

        if (entrepriseRepository.count() == 0) {
            Entreprise e = new Entreprise();
            e.setNom("OpenAI France");
            e.setAdresse("1 rue de l'IA");
            e.setEmail("contact@openai.fr");
            e.setSecteurActivite("Tech");
            e.setStatutJuridique("SAS");
            e.setTelephone("0102030405");

            entrepriseRepository.save(e);
            System.out.println("[DataInit] Entreprise créée.");
        }

        if (utilisateurRepository.count() == 0) {
            Optional<Role> adminRole = roleRepository.findByNom("ADMIN");
            Optional<Role> userRole = roleRepository.findByNom("UTILISATEUR");
            Entreprise entreprise = entrepriseRepository.findAll().get(0);

            Utilisateur admin = new Utilisateur();
            admin.setNom("Admin");
            admin.setPrenom("Systeme");
            admin.setEmail("admin@evenix.fr");
            admin.setMotDePasse("admin123");
            admin.setDateDeNaissance(Date.valueOf("1990-01-01"));
            admin.setRole(adminRole);
            admin.setEntreprise(entreprise);

            Utilisateur user = new Utilisateur();
            user.setNom("Durand");
            user.setPrenom("Jean");
            user.setEmail("jean.durand@evenix.fr");
            user.setMotDePasse("user123");
            user.setDateDeNaissance(Date.valueOf("1995-05-05"));
            user.setRole(userRole);
            user.setEntreprise(entreprise);

            utilisateurRepository.saveAll(List.of(admin, user));
            System.out.println("[DataInit] Utilisateurs initiaux créés.");
        }
    }
}

package com.evenix.config;

import com.evenix.entities.Entreprise;
import com.evenix.entities.Evenement;
import com.evenix.entities.Inscription;
import com.evenix.entities.Lieu;
import com.evenix.entities.LieuCulturel;
import com.evenix.entities.Paiement;
import com.evenix.entities.Role;
import com.evenix.entities.TypeEvenement;
import com.evenix.entities.TypeLieu;
import com.evenix.entities.TypeLieuCulturel;
import com.evenix.entities.Utilisateur;
import com.evenix.repos.EntrepriseRepository;
import com.evenix.repos.EvenementRepository;
import com.evenix.repos.InscriptionRepository;
import com.evenix.repos.LieuCulturelRepository;
import com.evenix.repos.LieuRepository;
import com.evenix.repos.PaiementRepository;
import com.evenix.repos.RoleRepository;
import com.evenix.repos.TypeEvenementRepository;
import com.evenix.repos.TypeLieuCulturelRepository;
import com.evenix.repos.TypeLieuRepository;
import com.evenix.repos.UtilisateurRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.Date;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired private RoleRepository roleRepository;
    @Autowired private EntrepriseRepository entrepriseRepository;
    @Autowired private UtilisateurRepository utilisateurRepository;
    @Autowired private TypeLieuRepository typeLieuRepository;
    @Autowired private TypeLieuCulturelRepository typeLieuCulturelRepository;
    @Autowired private LieuRepository lieuRepository;
    @Autowired private LieuCulturelRepository lieuCulturelRepository;
    @Autowired private PaiementRepository paiementRepository;
    @Autowired private EvenementRepository evenementRepository;
    @Autowired private InscriptionRepository inscriptionRepository;
    @Autowired private TypeEvenementRepository typeEvenementRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            Role admin = new Role();
            admin.setNom("ADMIN");

            Role user = new Role();
            user.setNom("UTILISATEUR");
            
            Role organisateur = new Role();
            organisateur.setNom("ORGANISATEUR");

            roleRepository.saveAll(List.of(admin, user, organisateur));
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
            
            Entreprise e1 = new Entreprise();
            e1.setNom("CyberSecure Solutions");
            e1.setAdresse("45 avenue de la Défense");
            e1.setEmail("contact@cybersecure.fr");
            e1.setSecteurActivite("Cybersécurité");
            e1.setStatutJuridique("SARL");
            e1.setTelephone("0145789652");

            Entreprise e2 = new Entreprise();
            e2.setNom("GreenTech Innov");
            e2.setAdresse("12 boulevard des Énergies");
            e2.setEmail("info@greentech-innov.com");
            e2.setSecteurActivite("Énergie renouvelable");
            e2.setStatutJuridique("SASU");
            e2.setTelephone("0178956423");


            entrepriseRepository.saveAll(List.of(e,e1,e2));
            System.out.println("[DataInit] Entreprise créée.");
        }

        Optional<Role> adminRoleOpt = roleRepository.findByNom("ADMIN");
        Optional<Role> userRoleOpt = roleRepository.findByNom("UTILISATEUR");
        Optional<Role> organisateurRoleOpt = roleRepository.findByNom("ORGANISATEUR");
        Entreprise entreprise = entrepriseRepository.findAll().get(0);
        Entreprise entreprise1 = entrepriseRepository.findAll().get(1);
        Entreprise entreprise2 = entrepriseRepository.findAll().get(2);

        if (adminRoleOpt.isPresent() && userRoleOpt.isPresent() && organisateurRoleOpt.isPresent()) {
            Role adminRole = adminRoleOpt.get();
            Role userRole = userRoleOpt.get();
            Role organisateurRole = organisateurRoleOpt.get();

            Utilisateur admin = new Utilisateur();
            admin.setNom("Admin");
            admin.setPrenom("Systeme");
            admin.setEmail("admin@evenix.fr");
            admin.setMotDePasse("admin123");
            admin.setDateDeNaissance(Date.valueOf("1990-01-01"));
            admin.setRole(adminRole);
            admin.setEntreprise(entreprise);

            Utilisateur user = new Utilisateur();
            user.setNom("Martin");
            user.setPrenom("Claire");
            user.setEmail("claire.martin@evenix.fr");
            user.setMotDePasse("claireM2024");
            user.setDateDeNaissance(Date.valueOf("1992-08-12"));
            user.setRole(userRole);
            user.setEntreprise(entreprise1);
            
            Utilisateur organisateur = new Utilisateur();
            organisateur.setNom("Lemoine");
            organisateur.setPrenom("Thomas");
            organisateur.setEmail("thomas.lemoine@evenix.fr");
            organisateur.setMotDePasse("thomasL2024");
            organisateur.setDateDeNaissance(Date.valueOf("1988-11-23"));
            organisateur.setRole(organisateurRole);
            organisateur.setEntreprise(entreprise2);
            
            utilisateurRepository.saveAll(List.of(admin, user, organisateur));
            System.out.println("[DataInit] Utilisateurs initiaux créés.");
        } else {
            System.err.println("[DataInit] ERREUR : Rôle ADMIN ou UTILISATEUR manquant.");
        }
        
        if (typeLieuCulturelRepository.count() == 0) {
            typeLieuCulturelRepository.saveAll(List.of(
                new TypeLieuCulturel("Musée"),
                new TypeLieuCulturel("Théâtre"),
                new TypeLieuCulturel("Cinéma")
            ));
        }

        if (typeLieuRepository.count() == 0) {
            typeLieuRepository.saveAll(List.of(
                new TypeLieu("Salle"),
                new TypeLieu("Amphithéâtre"),
                new TypeLieu("Studio")
            ));
        }
        
        if (typeEvenementRepository.count() == 0) {
            typeEvenementRepository.saveAll(List.of(
                new TypeEvenement("Conférence"),
                new TypeEvenement("Concert"),
                new TypeEvenement("Atelier")
            ));
            System.out.println("[DataInit] Types d'événements créés.");
        }

        
        if (lieuCulturelRepository.count() == 0 && typeLieuCulturelRepository.count() >= 3) {
            List<TypeLieuCulturel> typesCulturels = typeLieuCulturelRepository.findAll();
            lieuCulturelRepository.saveAll(List.of(
                new LieuCulturel("Musée d'art moderne", 48.8606f, 2.3376f, typesCulturels.get(0)),
                new LieuCulturel("Théâtre national", 45.7578f, 4.8320f, typesCulturels.get(1)),
                new LieuCulturel("Cinéma Gaumont", 43.6047f, 1.4442f, typesCulturels.get(2))
            ));
            System.out.println("[DataInit] Lieux culturels créés.");
        }

        if (lieuRepository.count() == 0 && typeLieuRepository.count() >= 3) {
            List<TypeLieu> types = typeLieuRepository.findAll();
            lieuRepository.saveAll(List.of(
                new Lieu(43.2965f, 5.3698f, "Salle Alpha", "10 rue des Arts, Marseille", 200, types.get(0)),
                new Lieu(50.6292f, 3.0573f, "Amphi Delta", "15 avenue Université, Lille", 300, types.get(1)),
                new Lieu(43.7102f, 7.2620f, "Studio B", "20 boulevard des Studios, Nice", 100, types.get(2))
            ));
            System.out.println("[DataInit] Lieux classiques créés.");
        }
        
        if (evenementRepository.count() == 0) {
            List<Lieu> lieux = lieuRepository.findAll();
            List<LieuCulturel> lieuxCulturels = lieuCulturelRepository.findAll();
            List<TypeEvenement> typesEvenement = typeEvenementRepository.findAll();
            List<Utilisateur> utilisateurs = utilisateurRepository.findAll();

            if (lieux.size() >= 3 && lieuxCulturels.size() >= 3 && typesEvenement.size() >= 3 && utilisateurs.size() >= 3) {

                Utilisateur organisateur = null;
                for (Utilisateur u : utilisateurs) {
                    if (u.getRole() != null && "ORGANISATEUR".equals(u.getRole().getNom())) {
                        organisateur = u;
                        break;
                    }
                }

                if (organisateur == null) {
                    System.err.println("[DataInit] ERREUR : Aucun utilisateur avec le rôle ORGANISATEUR.");
                    return;
                }

                Evenement ev1 = new Evenement(
                    "Conférence IA",
                    ZonedDateTime.now().plusDays(5),
                    ZonedDateTime.now().plusDays(6),
                    true,
                    "Une conférence sur l'intelligence artificielle et ses enjeux.",
                    25.0f,
                    lieux.get(0),
                    organisateur,
                    Set.of(typesEvenement.get(0)),
                    Set.of(lieuxCulturels.get(0))
                );

                Evenement ev2 = new Evenement(
                    "Concert de Jazz",
                    ZonedDateTime.now().plusDays(10),
                    ZonedDateTime.now().plusDays(10).plusHours(2),
                    true,
                    "Concert de jazz dans une ambiance feutrée.",
                    15.0f,
                    lieux.get(1),
                    organisateur,
                    Set.of(typesEvenement.get(1)),
                    Set.of(lieuxCulturels.get(1))
                );

                Evenement ev3 = new Evenement(
                    "Atelier de codage",
                    ZonedDateTime.now().plusDays(3),
                    ZonedDateTime.now().plusDays(3).plusHours(2),
                    false,
                    "Initiation à la programmation pour débutants.",
                    0.0f,
                    lieux.get(2),
                    organisateur,
                    Set.of(typesEvenement.get(2)),
                    Set.of(lieuxCulturels.get(2))
                );

                evenementRepository.saveAll(List.of(ev1, ev2, ev3));
                System.out.println("[DataInit] Événements créés.");
            } else {
                System.err.println("[DataInit] ERREUR : Données insuffisantes pour créer des événements.");
            }
        }
        
        if (inscriptionRepository.count() == 0) {
            List<Utilisateur> utilisateurs = utilisateurRepository.findAll();
            List<Evenement> evenements = evenementRepository.findAll();

            if (utilisateurs.size() >= 2 && evenements.size() >= 3) {
                Utilisateur user = utilisateurs.stream()
                    .filter(u -> "UTILISATEUR".equals(u.getRole().getNom()))
                    .findFirst()
                    .orElse(null);

                Utilisateur admin = utilisateurs.stream()
                    .filter(u -> "ADMIN".equals(u.getRole().getNom()))
                    .findFirst()
                    .orElse(null);

                if (user == null || admin == null) {
                    System.err.println("[DataInit] ERREUR : Utilisateurs nécessaires pour les inscriptions non trouvés.");
                    return;
                }

                Inscription i1 = new Inscription(user, evenements.get(0), ZonedDateTime.now().minusDays(1));
                Inscription i2 = new Inscription(user, evenements.get(1), ZonedDateTime.now().minusHours(12));
                Inscription i3 = new Inscription(admin, evenements.get(2), ZonedDateTime.now());

                inscriptionRepository.saveAll(List.of(i1, i2, i3));
                System.out.println("[DataInit] Inscriptions créées.");
            } else {
                System.err.println("[DataInit] ERREUR : Pas assez d'utilisateurs ou d'événements pour créer des inscriptions.");
            }
        }
        
        if (paiementRepository.count() == 0) {
            List<Utilisateur> utilisateurs = utilisateurRepository.findAll();
            List<Evenement> evenements = evenementRepository.findAll();

            if (utilisateurs.size() >= 2 && evenements.size() >= 3) {
                Utilisateur user = utilisateurs.stream()
                    .filter(u -> "UTILISATEUR".equals(u.getRole().getNom()))
                    .findFirst()
                    .orElse(null);

                Utilisateur admin = utilisateurs.stream()
                    .filter(u -> "ADMIN".equals(u.getRole().getNom()))
                    .findFirst()
                    .orElse(null);

                if (user == null || admin == null) {
                    System.err.println("[DataInit] ERREUR : Utilisateurs nécessaires pour les paiements non trouvés.");
                    return;
                }

                Paiement p1 = new Paiement(25.0f, ZonedDateTime.now().minusDays(1), "PAI123456", user, evenements.get(0));
                Paiement p2 = new Paiement(15.0f, ZonedDateTime.now().minusHours(20), "PAI123457", user, evenements.get(1));
                Paiement p3 = new Paiement(25.0f, ZonedDateTime.now().minusHours(6), "PAI123458", admin, evenements.get(0));

                paiementRepository.saveAll(List.of(p1, p2, p3));
                System.out.println("[DataInit] Paiements créés.");
            } else {
                System.err.println("[DataInit] ERREUR : Pas assez de données pour générer les paiements.");
            }
        }



    }
}

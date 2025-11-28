package com.evenix;

import com.evenix.entities.Evenement;
import com.evenix.entities.Lieu;
import com.evenix.entities.Role;
import com.evenix.entities.TypeLieu;
import com.evenix.entities.Utilisateur;
import com.evenix.entities.Entreprise;
import com.evenix.services.EvenementServiceImpl;
import com.evenix.services.LieuServiceImpl;
import com.evenix.services.RoleServiceImpl;
import com.evenix.services.TypeLieuServiceImpl;
import com.evenix.services.UtilisateurServiceImpl;
import com.evenix.services.EntrepriseServiceImpl;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EvenixApplication {

    public static void main(String[] args) {
        SpringApplication.run(EvenixApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(UtilisateurServiceImpl utilisateurService,
                               RoleServiceImpl roleService,
                               LieuServiceImpl lieuService,
                               TypeLieuServiceImpl typeLieuService,
                               EvenementServiceImpl evenementService,
                               EntrepriseServiceImpl entrepriseService) {

        return args -> {

            // -------------------------------
            // 1. Création des rôles + admins
            // -------------------------------

            createRoleIfMissing(roleService, "ADMIN");
            createRoleIfMissing(roleService, "PARTICIPANT");
            createRoleIfMissing(roleService, "ORGANISATEUR");

            createUserIfMissing(utilisateurService, roleService,
                    "admin", "123", "ADMIN", "admin123@admin.com");
            createUserIfMissing(utilisateurService, roleService,
                    "user1", "123", "PARTICIPANT", "user1@admin.com");
            createUserIfMissing(utilisateurService, roleService,
                    "user2", "123", "PARTICIPANT", "user2@admin.com");
            createUserIfMissing(utilisateurService, roleService,
                    "user3", "123", "PARTICIPANT", "user3@admin.com");
            createUserIfMissing(utilisateurService, roleService,
                    "user4", "123", "ORGANISATEUR", "user4@admin.com");
            createUserIfMissing(utilisateurService, roleService,
                    "user5", "123", "ORGANISATEUR", "user5@admin.com");

            Utilisateur admin = utilisateurService.findUtilisateurByNom("admin")
                    .orElseThrow(() -> new IllegalStateException("Admin introuvable"));

            // -------------------------------
            // 2. Création d’un TypeLieu par défaut
            // -------------------------------

            TypeLieu typeSalle = typeLieuService.findByLibelle("Salle")
                    .orElseGet(() -> typeLieuService.save(new TypeLieu("Salle")));

            // -------------------------------
            // 3. Création de 3 lieux par défaut
            // -------------------------------

            Lieu l1 = createLieuIfMissing(lieuService, "Salle Lumière",
                    "12 rue des Arts", "Paris", 120, 48.85f, 2.34f, typeSalle);
            Lieu l2 = createLieuIfMissing(lieuService, "Agora",
                    "5 avenue Victor Hugo", "Lyon", 200, 45.76f, 4.84f, typeSalle);
            Lieu l3 = createLieuIfMissing(lieuService, "Le Forum",
                    "42 rue Nationale", "Lille", 150, 50.63f, 3.06f, typeSalle);

            List<Lieu> lieux = List.of(l1, l2, l3);

            // -------------------------------
            // 3 bis. Création de 10 entreprises
            // -------------------------------

            createEntrepriseIfMissing(entrepriseService,
                    "TechNova Solutions", "SARL",
                    "15 rue du Numérique, 75010 Paris",
                    "Informatique / ESN",
                    "0155123456",
                    "contact@technova.fr");

            createEntrepriseIfMissing(entrepriseService,
                    "GreenCity Events", "SAS",
                    "8 avenue des Jardins, 69003 Lyon",
                    "Événementiel / Développement durable",
                    "0472001122",
                    "hello@greencity-events.fr");

            createEntrepriseIfMissing(entrepriseService,
                    "DataWave Analytics", "SASU",
                    "22 boulevard des Données, 31000 Toulouse",
                    "Data / IA",
                    "0561445566",
                    "info@datawave.fr");

            createEntrepriseIfMissing(entrepriseService,
                    "Culture&Co", "Association",
                    "5 place du Théâtre, 59000 Lille",
                    "Culture / Associations",
                    "0320121314",
                    "contact@cultureandco.fr");

            createEntrepriseIfMissing(entrepriseService,
                    "BlueSea Conferences", "SARL",
                    "10 quai des Docks, 13002 Marseille",
                    "Organisation de conférences",
                    "0491939495",
                    "contact@bluesea-conf.fr");

            createEntrepriseIfMissing(entrepriseService,
                    "FutureLab Startups", "SAS",
                    "3 rue des Startups, 35000 Rennes",
                    "Incubateur / Innovation",
                    "0299454545",
                    "team@futurelab.fr");

            createEntrepriseIfMissing(entrepriseService,
                    "ArtLine Studio", "EURL",
                    "18 rue des Artistes, 44000 Nantes",
                    "Design / Communication visuelle",
                    "0240404040",
                    "contact@artline-studio.fr");

            createEntrepriseIfMissing(entrepriseService,
                    "EventSphere Global", "SAS",
                    "7 rue des Congrès, 67000 Strasbourg",
                    "Événementiel international",
                    "0388606060",
                    "info@eventsphere.fr");

            createEntrepriseIfMissing(entrepriseService,
                    "Food&Smile Traiteur", "SARL",
                    "25 rue des Gourmets, 33000 Bordeaux",
                    "Restauration / Traiteur",
                    "0556565656",
                    "contact@foodandsmile.fr");

            createEntrepriseIfMissing(entrepriseService,
                    "SportVibes Management", "SAS",
                    "9 allée des Stades, 34000 Montpellier",
                    "Gestion d’événements sportifs",
                    "0467676767",
                    "contact@sportvibes.fr");

            // -------------------------------
            // 4. Création de 10 événements
            // -------------------------------

            for (int i = 1; i <= 10; i++) {
                String nomEvent = "Événement " + i;

                // On évite les doublons
                if (evenementService.findByNom(nomEvent).isEmpty()) {

                    Lieu lieuChoisi = lieux.get((i - 1) % lieux.size());

                    Evenement ev = new Evenement(
                            nomEvent,
                            ZonedDateTime.now().plusDays(i),
                            ZonedDateTime.now().plusDays(i + 1),
                            i % 2 == 0, // payant un coup sur deux
                            "Description de l'événement " + i,
                            (i % 2 == 0) ? 25.0f : 0.0f,
                            lieuChoisi,
                            admin
                    );

                    ev.setVille(lieuChoisi.getVille());

                    evenementService.save(ev);
                }
            }

            System.out.println("=== Données initiales chargées ===");
        };
    }

    private void createRoleIfMissing(RoleServiceImpl roleService, String roleName) {
        boolean exists = roleService.getAllRoles().stream()
                .anyMatch(r -> r.getNom() != null && r.getNom().equalsIgnoreCase(roleName));
        if (!exists) {
            roleService.createRole(new Role(roleName));
        }
    }

    private void createUserIfMissing(UtilisateurServiceImpl utilisateurService,
                                     RoleServiceImpl roleService,
                                     String nom, String rawPwd, String roleName, String email) {
        if (utilisateurService.findUtilisateurByNom(nom).isEmpty()) {
            Utilisateur u = new Utilisateur();
            u.setNom(nom);
            u.setMotDePasse(rawPwd);
            u.setEmail(email);
            Role role = roleService.getAllRoles().stream()
                    .filter(r -> roleName.equalsIgnoreCase(r.getNom()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalStateException("Rôle " + roleName + " introuvable"));
            u.setRole(role);
            utilisateurService.saveUtilisateur(u);
        }
    }

    private Lieu createLieuIfMissing(LieuServiceImpl lieuService,
                                     String nom,
                                     String adresse,
                                     String ville,
                                     int nbPlaces,
                                     float lat,
                                     float lng,
                                     TypeLieu typeLieu) {

        return lieuService.getByNom(nom)
                .orElseGet(() -> lieuService.save(
                        new Lieu(lat, lng, nom, adresse, nbPlaces, typeLieu, ville)
                ));
    }

    private void createEntrepriseIfMissing(EntrepriseServiceImpl entrepriseService,
                                           String nom,
                                           String statutJuridique,
                                           String adresse,
                                           String secteurActivite,
                                           String telephone,
                                           String email) {

        if (entrepriseService.findByNom(nom).isEmpty()) {
            Entreprise e = new Entreprise(
                    nom,
                    statutJuridique,
                    adresse,
                    secteurActivite,
                    telephone,
                    email
            );
            entrepriseService.save(e);
        }
    }

}

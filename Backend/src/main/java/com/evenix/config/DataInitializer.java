package com.evenix.config;

import com.evenix.entities.*;
import com.evenix.repos.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final EvenementRepository evenementRepository;
    private final LieuRepository lieuRepository;
    private final TypeEvenementRepository typeEvenementRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UtilisateurRepository utilisateurRepository,
                           EntrepriseRepository entrepriseRepository,
                           EvenementRepository evenementRepository,
                           LieuRepository lieuRepository,
                           TypeEvenementRepository typeEvenementRepository,
                           BCryptPasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.entrepriseRepository = entrepriseRepository;
        this.evenementRepository = evenementRepository;
        this.lieuRepository = lieuRepository;
        this.typeEvenementRepository = typeEvenementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        // On ne lance l'init que si la base est vide (pour éviter les doublons au redémarrage)
        if (roleRepository.count() == 0) {
            System.out.println(">>> DÉBUT DE L'INITIALISATION DES DONNÉES <<<");

            // ==========================================
            // 1. RÔLES
            // ==========================================
            Role adminRole = roleRepository.save(new Role("ADMIN"));
            Role orgaRole = roleRepository.save(new Role("ORGANISATEUR"));
            Role participantRole = roleRepository.save(new Role("PARTICIPANT"));

            // ==========================================
            // 2. ENTREPRISE
            // ==========================================
            Entreprise evenixCorp = new Entreprise();
            evenixCorp.setNom("Evenix Corp");
            evenixCorp.setEmail("contact@evenix.com");
            evenixCorp.setAdresse("123 Avenue de la Tech, Paris");
            entrepriseRepository.save(evenixCorp);

            // ==========================================
            // 3. UTILISATEURS
            // ==========================================
            
            // Admin
            Utilisateur admin = new Utilisateur();
            admin.setNom("System"); 
            admin.setPrenom("Admin"); 
            admin.setEmail("admin@evenix.com");
            admin.setMotDePasse(passwordEncoder.encode("admin123"));
            admin.setRole(adminRole);
            admin.setTelephone("0102030405"); 
            admin.setDateDeNaissance(LocalDate.of(1980, 1, 1));
            admin.setDateCreation(LocalDateTime.now());
            admin.setEstConfirme(true);
            utilisateurRepository.save(admin);

            // Organisateur (Jean Dupont)
            Utilisateur orga = new Utilisateur();
            orga.setNom("Dupont"); 
            orga.setPrenom("Jean"); 
            orga.setEmail("orga@evenix.com");
            orga.setMotDePasse(passwordEncoder.encode("orga123"));
            orga.setRole(orgaRole);
            orga.setEntreprise(evenixCorp);
            orga.setTelephone("0611223344"); 
            orga.setDateDeNaissance(LocalDate.of(1990, 5, 15));
            orga.setDateCreation(LocalDateTime.now());
            orga.setEstConfirme(true);
            utilisateurRepository.save(orga);

            // Participant (Sophie Martin)
            Utilisateur user1 = new Utilisateur();
            user1.setNom("Martin"); 
            user1.setPrenom("Sophie"); 
            user1.setEmail("user1@gmail.com");
            user1.setMotDePasse(passwordEncoder.encode("password"));
            user1.setRole(participantRole);
            user1.setTelephone("0799887766"); 
            user1.setDateDeNaissance(LocalDate.of(1995, 12, 25));
            user1.setDateCreation(LocalDateTime.now());
            user1.setEstConfirme(true);
            utilisateurRepository.save(user1);

            // ==========================================
            // 4. LIEUX (Avec données compatibles Google Maps)
            // ==========================================
            
            Lieu grandRex = new Lieu(); 
            grandRex.setNom("Le Grand Rex"); 
            grandRex.setAdresse("1 Boulevard Poissonnière, 75002 Paris, France"); 
            grandRex.setVille("Paris");
            grandRex.setCodePostal("75002");
            grandRex.setLatitude(48.8703); 
            grandRex.setLongitude(2.3483);
            grandRex.setTypeLieu("movie_theater");
            grandRex.setGooglePlaceId("ChIJa4f8_9hu5kcRk4e5_9hu5kc"); // ID fictif pour démo
            grandRex.setCapaciteMax(2700);
            lieuRepository.save(grandRex);

            Lieu stationF = new Lieu(); 
            stationF.setNom("Station F"); 
            stationF.setAdresse("5 Parvis Alan Turing, 75013 Paris, France"); 
            stationF.setVille("Paris");
            stationF.setCodePostal("75013");
            stationF.setLatitude(48.8345); 
            stationF.setLongitude(2.3706);
            stationF.setTypeLieu("point_of_interest");
            stationF.setGooglePlaceId("ChIJ_3y5_9hu5kcRk4e5_stationf");
            stationF.setCapaciteMax(1000);
            lieuRepository.save(stationF);

            Lieu parcPrinces = new Lieu(); 
            parcPrinces.setNom("Parc des Princes"); 
            parcPrinces.setAdresse("24 Rue du Commandant Guilbaud, 75016 Paris, France"); 
            parcPrinces.setVille("Paris");
            parcPrinces.setCodePostal("75016");
            parcPrinces.setLatitude(48.8414); 
            parcPrinces.setLongitude(2.2530);
            parcPrinces.setTypeLieu("stadium");
            parcPrinces.setGooglePlaceId("ChIJ_parc_9hu5kcRk4e5_princes");
            parcPrinces.setCapaciteMax(48000);
            lieuRepository.save(parcPrinces);

            Lieu villette = new Lieu(); 
            villette.setNom("Grande Halle de la Villette"); 
            villette.setAdresse("211 Avenue Jean Jaurès, 75019 Paris, France"); 
            villette.setVille("Paris");
            villette.setCodePostal("75019");
            villette.setLatitude(48.8898); 
            villette.setLongitude(2.3899);
            villette.setTypeLieu("event_venue");
            villette.setGooglePlaceId("ChIJ_villette_9hu5kcRk4e5");
            villette.setCapaciteMax(5000);
            lieuRepository.save(villette);

            Lieu louvre = new Lieu(); 
            louvre.setNom("Musée du Louvre"); 
            louvre.setAdresse("Rue de Rivoli, 75001 Paris, France"); 
            louvre.setVille("Paris");
            louvre.setCodePostal("75001");
            louvre.setLatitude(48.8606); 
            louvre.setLongitude(2.3376);
            louvre.setTypeLieu("museum");
            louvre.setGooglePlaceId("ChIJ_louvre_9hu5kcRk4e5");
            louvre.setCapaciteMax(500);
            lieuRepository.save(louvre);

            // ==========================================
            // 5. TYPES D'ÉVÉNEMENTS
            // ==========================================
            TypeEvenement musique = typeEvenementRepository.save(new TypeEvenement("Musique"));
            TypeEvenement tech = typeEvenementRepository.save(new TypeEvenement("Technologie"));
            TypeEvenement sport = typeEvenementRepository.save(new TypeEvenement("Sport"));
            TypeEvenement art = typeEvenementRepository.save(new TypeEvenement("Art & Culture"));
            TypeEvenement gastro = typeEvenementRepository.save(new TypeEvenement("Gastronomie"));

            // ==========================================
            // 6. CRÉATION DES ÉVÉNEMENTS
            // ==========================================
            System.out.println(">>> Création des événements...");
            LocalDateTime now = LocalDateTime.now();

            // --- Event 1 : Concert ---
            Evenement ev1 = new Evenement();
            ev1.setNom("Concert Symphonique de Paris");
            ev1.setDateDebut(now.plusDays(10).withHour(20).withMinute(0));
            ev1.setDateFin(now.plusDays(10).withHour(23).withMinute(0));
            ev1.setDescription("Une soirée inoubliable avec l'orchestre philharmonique de Paris. Venez découvrir les classiques de Beethoven et Mozart dans une salle mythique.");
            ev1.setPrix(45.50);
            ev1.setImageUrl("https://images.unsplash.com/photo-1514525253440-b393452e3383?w=800&auto=format&fit=crop&q=60");
            ev1.setLieu(grandRex);
            ev1.setUtilisateur(orga);
            ev1.setTypesEvenement(new HashSet<>(Arrays.asList(musique, art)));
            evenementRepository.save(ev1);

            // --- Event 2 : Tech Meetup ---
            Evenement ev2 = new Evenement();
            ev2.setNom("Spring Boot Developer Day");
            ev2.setDateDebut(now.plusDays(5).withHour(9).withMinute(0));
            ev2.setDateFin(now.plusDays(5).withHour(18).withMinute(0));
            ev2.setDescription("Rencontre annuelle des développeurs Java et Spring. Ateliers, conférences et networking au coeur de la Station F.");
            ev2.setPrix(0.0);
            ev2.setImageUrl("https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=60");
            ev2.setLieu(stationF);
            ev2.setUtilisateur(orga);
            ev2.setTypesEvenement(new HashSet<>(Arrays.asList(tech)));
            evenementRepository.save(ev2);

            // --- Event 3 : Match de Foot ---
            Evenement ev3 = new Evenement();
            ev3.setNom("Finale Coupe Régionale");
            ev3.setDateDebut(now.plusMonths(1).withHour(21).withMinute(0));
            ev3.setDateFin(now.plusMonths(1).withHour(23).withMinute(0));
            ev3.setDescription("Le grand match tant attendu de la saison. Venez supporter votre équipe locale au Parc des Princes !");
            ev3.setPrix(25.0);
            ev3.setImageUrl("https://images.unsplash.com/photo-1522778119026-d647f0565c6a?w=800&auto=format&fit=crop&q=60");
            ev3.setLieu(parcPrinces);
            ev3.setUtilisateur(admin);
            ev3.setTypesEvenement(new HashSet<>(Arrays.asList(sport)));
            evenementRepository.save(ev3);

            // --- Event 4 : Expo Art ---
            Evenement ev4 = new Evenement();
            ev4.setNom("Nuit des Musées : Nocturne");
            ev4.setDateDebut(now.plusWeeks(2).withHour(19).withMinute(0));
            ev4.setDateFin(now.plusWeeks(2).withHour(23).withMinute(59));
            ev4.setDescription("Visite guidée exclusive des nouvelles collections du Louvre à la tombée de la nuit.");
            ev4.setPrix(12.0);
            ev4.setImageUrl("https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&auto=format&fit=crop&q=60");
            ev4.setLieu(louvre);
            ev4.setUtilisateur(orga);
            ev4.setTypesEvenement(new HashSet<>(Arrays.asList(art)));
            evenementRepository.save(ev4);

            // --- Event 5 : Festival Food ---
            Evenement ev5 = new Evenement();
            ev5.setNom("Street Food Festival");
            ev5.setDateDebut(now.plusMonths(2).withHour(11).withMinute(0));
            ev5.setDateFin(now.plusMonths(2).plusDays(2).withHour(22).withMinute(0));
            ev5.setDescription("Le meilleur de la cuisine de rue réuni en un seul lieu. Plus de 50 food trucks venus du monde entier.");
            ev5.setPrix(0.0);
            ev5.setImageUrl("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=60");
            ev5.setLieu(villette);
            ev5.setUtilisateur(orga);
            ev5.setTypesEvenement(new HashSet<>(Arrays.asList(gastro, art)));
            evenementRepository.save(ev5);

            // --- Event 6 : Hackathon ---
            Evenement ev6 = new Evenement();
            ev6.setNom("Hackathon Green Code");
            ev6.setDateDebut(now.plusDays(20).withHour(18).withMinute(0));
            ev6.setDateFin(now.plusDays(22).withHour(18).withMinute(0));
            ev6.setDescription("48h pour coder une solution écologique. Prix à gagner : 10 000€.");
            ev6.setPrix(15.0);
            ev6.setImageUrl("https://images.unsplash.com/photo-1504384308090-c54be3852f33?w=800&auto=format&fit=crop&q=60");
            ev6.setLieu(stationF);
            ev6.setUtilisateur(orga);
            ev6.setTypesEvenement(new HashSet<>(Arrays.asList(tech)));
            evenementRepository.save(ev6);

            // --- Event 7 : Cours de Yoga ---
            Evenement ev7 = new Evenement();
            ev7.setNom("Grand Yoga Collectif");
            ev7.setDateDebut(now.plusDays(3).withHour(10).withMinute(0));
            ev7.setDateFin(now.plusDays(3).withHour(12).withMinute(0));
            ev7.setDescription("Séance de yoga géante ouverte à tous les niveaux. Tapis fournis.");
            ev7.setPrix(5.0);
            ev7.setImageUrl("https://images.unsplash.com/photo-1544367563-12123d8959bd?w=800&auto=format&fit=crop&q=60");
            ev7.setLieu(villette);
            ev7.setUtilisateur(orga);
            ev7.setTypesEvenement(new HashSet<>(Arrays.asList(sport)));
            evenementRepository.save(ev7);

            // --- Event 8 : Cinéma ---
            Evenement ev8 = new Evenement();
            ev8.setNom("Avant-première : Le Futur");
            ev8.setDateDebut(now.plusDays(7).withHour(20).withMinute(30));
            ev8.setDateFin(now.plusDays(7).withHour(23).withMinute(0));
            ev8.setDescription("Projection exclusive en présence de l'équipe du film. Cocktail offert après la séance.");
            ev8.setPrix(20.0);
            ev8.setImageUrl("https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=60");
            ev8.setLieu(grandRex);
            ev8.setUtilisateur(orga);
            ev8.setTypesEvenement(new HashSet<>(Arrays.asList(art)));
            evenementRepository.save(ev8);

            // --- Event 9 : Atelier Cuisine ---
            Evenement ev9 = new Evenement();
            ev9.setNom("Masterclass Pâtisserie");
            ev9.setDateDebut(now.plusWeeks(3).withHour(14).withMinute(0));
            ev9.setDateFin(now.plusWeeks(3).withHour(17).withMinute(0));
            ev9.setDescription("Apprenez à faire des macarons comme un chef. Matériel et ingrédients fournis.");
            ev9.setPrix(80.0);
            ev9.setImageUrl("https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&auto=format&fit=crop&q=60");
            ev9.setLieu(stationF); 
            ev9.setUtilisateur(orga);
            ev9.setTypesEvenement(new HashSet<>(Arrays.asList(gastro)));
            evenementRepository.save(ev9);

            // --- Event 10 : Conférence ---
            Evenement ev10 = new Evenement();
            ev10.setNom("L'avenir de l'IA");
            ev10.setDateDebut(now.plusMonths(1).plusDays(5).withHour(9).withMinute(0));
            ev10.setDateFin(now.plusMonths(1).plusDays(5).withHour(12).withMinute(0));
            ev10.setDescription("Conférence avec des experts mondiaux de l'intelligence artificielle.");
            ev10.setPrix(150.0);
            ev10.setImageUrl("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60");
            ev10.setLieu(stationF);
            ev10.setUtilisateur(admin);
            ev10.setTypesEvenement(new HashSet<>(Arrays.asList(tech)));
            evenementRepository.save(ev10);

            System.out.println(">>> 10 Événements créés avec succès !");
            System.out.println(">>> FIN DE L'INITIALISATION DES DONNÉES <<<");
        }
    }
}
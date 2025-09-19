package com.evenix.config;

import com.evenix.entities.*;
import com.evenix.repos.*;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;

import java.sql.Date;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Component
@Profile("dev")              // <-- active le seed uniquement sur le profil "dev"
@Transactional               // <-- rend le seed atomique (tout ou rien)
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

    // -------- Helpers génériques idempotents (pas de méthodes custom requises) --------

    private Role ensureRole(String nom) {
        return roleRepository.findAll().stream()
                .filter(r -> nom.equalsIgnoreCase(r.getNom()))
                .findFirst()
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setNom(nom);
                    return roleRepository.save(r);
                });
    }

    private Entreprise ensureEntreprise(String nom, String adresse, String email,
                                       String secteur, String statut, String tel) {
        return entrepriseRepository.findAll().stream()
                .filter(e -> nom.equalsIgnoreCase(e.getNom()))
                .findFirst()
                .orElseGet(() -> {
                    Entreprise e = new Entreprise();
                    e.setNom(nom);
                    e.setAdresse(adresse);
                    e.setEmail(email);
                    e.setSecteurActivite(secteur);
                    e.setStatutJuridique(statut);
                    e.setTelephone(tel);
                    return entrepriseRepository.save(e);
                });
    }

    private Utilisateur ensureUserByEmail(String email,
                                          String nom, String prenom,
                                          String motDePasse, Date dateNaissance,
                                          Role role, Entreprise entreprise) {
        return utilisateurRepository.findAll().stream()
                .filter(u -> email.equalsIgnoreCase(u.getEmail()))
                .findFirst()
                .orElseGet(() -> {
                    Utilisateur u = new Utilisateur();
                    u.setNom(nom);
                    u.setPrenom(prenom);
                    u.setEmail(email);
                    u.setMotDePasse(motDePasse); // ⚠ idéalement encoder (BCrypt) si Spring Security actif
                    u.setDateDeNaissance(dateNaissance);
                    u.setRole(role);
                    u.setEntreprise(entreprise);
                    return utilisateurRepository.save(u);
                });
    }

    private TypeLieu ensureTypeLieu(String nom) {
        return typeLieuRepository.findAll().stream()
                .filter(t -> nom.equalsIgnoreCase(t.getLibelle()))
                .findFirst()
                .orElseGet(() -> typeLieuRepository.save(new TypeLieu(nom)));
    }

    private TypeLieuCulturel ensureTypeLieuCulturel(String nom) {
        return typeLieuCulturelRepository.findAll().stream()
                .filter(t -> nom.equalsIgnoreCase(t.getNom()))
                .findFirst()
                .orElseGet(() -> typeLieuCulturelRepository.save(new TypeLieuCulturel(nom)));
    }

    private TypeEvenement ensureTypeEvenement(String nom) {
        return typeEvenementRepository.findAll().stream()
                .filter(t -> nom.equalsIgnoreCase(t.getNom()))
                .findFirst()
                .orElseGet(() -> typeEvenementRepository.save(new TypeEvenement(nom)));
    }

    private Lieu ensureLieu(String nom, String adresse, float lat, float lon, int capacite, TypeLieu type) {
        // Clé métier ici = nom (à adapter si tu préfères une autre clé)
        return lieuRepository.findAll().stream()
                .filter(l -> nom.equalsIgnoreCase(l.getNom()))
                .findFirst()
                .orElseGet(() -> {
                    Lieu l = new Lieu(lat, lon, nom, adresse, capacite, type);
                    return lieuRepository.save(l);
                });
    }

    private LieuCulturel ensureLieuCulturel(String nom, float lat, float lon, TypeLieuCulturel type) {
        // Clé métier ici = nom
        return lieuCulturelRepository.findAll().stream()
                .filter(lc -> nom.equalsIgnoreCase(lc.getNom()))
                .findFirst()
                .orElseGet(() -> {
                    LieuCulturel lc = new LieuCulturel(nom, lat, lon, type);
                    return lieuCulturelRepository.save(lc);
                });
    }

    private Evenement ensureEvenement(String titre,
                                      ZonedDateTime debut, ZonedDateTime fin,
                                      boolean payant, String description, float prix,
                                      Lieu lieu, Utilisateur organisateur,
                                      Set<TypeEvenement> types, Set<LieuCulturel> lieuxCulturels) {
        // Clé métier = (titre + début)
        return evenementRepository.findAll().stream()
                .filter(e -> titre.equalsIgnoreCase(e.getNom())
                        && e.getDateDebut() != null
                        && e.getDateDebut().toInstant().equals(debut.toInstant()))
                .findFirst()
                .orElseGet(() -> {
                    Evenement ev = new Evenement(
                            titre, debut, fin, payant, description, prix,
                            lieu, organisateur, types, lieuxCulturels
                    );
                    return evenementRepository.save(ev);
                });
    }

    private Inscription ensureInscription(Utilisateur utilisateur, Evenement evenement, ZonedDateTime date) {
        // Unicité logique: (utilisateur, evenement)
        return inscriptionRepository.findAll().stream()
                .filter(i -> i.getUtilisateur() != null && i.getEvenement() != null
                        && Objects.equals(i.getUtilisateur().getId(), utilisateur.getId())
                        && Objects.equals(i.getEvenement().getId(), evenement.getId()))
                .findFirst()
                .orElseGet(() -> inscriptionRepository.save(new Inscription(utilisateur, evenement, date)));
    }

    private Paiement ensurePaiement(String reference, float montant, ZonedDateTime date, Utilisateur utilisateur, Evenement evenement) {
        // Unicité logique: reference
        return paiementRepository.findAll().stream()
                .filter(p -> reference.equalsIgnoreCase(p.getCode()))
                .findFirst()
                .orElseGet(() -> paiementRepository.save(new Paiement(montant, date, reference, utilisateur, evenement)));
    }

    // ------------------- Run -------------------

    @Override
    public void run(String... args) {

        // 1) Rôles
        Role adminRole        = ensureRole("ADMIN");
        Role userRole         = ensureRole("UTILISATEUR");
        Role organisateurRole = ensureRole("ORGANISATEUR");

        // 2) Entreprises
        Entreprise e  = ensureEntreprise("OpenAI France",        "1 rue de l'IA",                     "contact@openai.fr",         "Tech",                "SAS",  "0102030405");
        Entreprise e1 = ensureEntreprise("CyberSecure Solutions", "45 avenue de la Défense",          "contact@cybersecure.fr",    "Cybersécurité",       "SARL", "0145789652");
        Entreprise e2 = ensureEntreprise("GreenTech Innov",       "12 boulevard des Énergies",        "info@greentech-innov.com",  "Énergie renouvelable","SASU", "0178956423");

        // 3) Utilisateurs (emails uniques)
        Utilisateur admin = ensureUserByEmail(
                "admin@evenix.fr", "Admin", "Systeme", "admin123",
                Date.valueOf("1990-01-01"), adminRole, e
        );
        Utilisateur user = ensureUserByEmail(
                "claire.martin@evenix.fr", "Martin", "Claire", "claireM2024",
                Date.valueOf("1992-08-12"), userRole, e1
        );
        Utilisateur organisateur = ensureUserByEmail(
                "thomas.lemoine@evenix.fr", "Lemoine", "Thomas", "thomasL2024",
                Date.valueOf("1988-11-23"), organisateurRole, e2
        );

        // 4) Types de lieux / lieux culturels / types d'événements
        TypeLieuCulturel tlcMusee    = ensureTypeLieuCulturel("Musée");
        TypeLieuCulturel tlcTheatre  = ensureTypeLieuCulturel("Théâtre");
        TypeLieuCulturel tlcCinema   = ensureTypeLieuCulturel("Cinéma");

        TypeLieu tlSalle        = ensureTypeLieu("Salle");
        TypeLieu tlAmphi        = ensureTypeLieu("Amphithéâtre");
        TypeLieu tlStudio       = ensureTypeLieu("Studio");

        TypeEvenement teConf    = ensureTypeEvenement("Conférence");
        TypeEvenement teConcert = ensureTypeEvenement("Concert");
        TypeEvenement teAtelier = ensureTypeEvenement("Atelier");

        // 5) Lieux culturels
        LieuCulturel lc1 = ensureLieuCulturel("Musée d'art moderne", 48.8606f, 2.3376f, tlcMusee);
        LieuCulturel lc2 = ensureLieuCulturel("Théâtre national",    45.7578f, 4.8320f, tlcTheatre);
        LieuCulturel lc3 = ensureLieuCulturel("Cinéma Gaumont",      43.6047f, 1.4442f, tlcCinema);

        // 6) Lieux "classiques"
        Lieu l1 = ensureLieu("Salle Alpha",  "10 rue des Arts, Marseille", 43.2965f, 5.3698f, 200, tlSalle);
        Lieu l2 = ensureLieu("Amphi Delta",  "15 avenue Université, Lille", 50.6292f, 3.0573f, 300, tlAmphi);
        Lieu l3 = ensureLieu("Studio B",     "20 boulevard des Studios, Nice", 43.7102f, 7.2620f, 100, tlStudio);

        // 7) Événements (clé = titre + début)
        Evenement ev1 = ensureEvenement(
                "Conférence IA",
                ZonedDateTime.now().plusDays(5),
                ZonedDateTime.now().plusDays(6),
                true,
                "Une conférence sur l'intelligence artificielle et ses enjeux.",
                25.0f,
                l1,
                organisateur,
                setOf(teConf),
                setOf(lc1)
        );

        Evenement ev2 = ensureEvenement(
                "Concert de Jazz",
                ZonedDateTime.now().plusDays(10),
                ZonedDateTime.now().plusDays(10).plusHours(2),
                true,
                "Concert de jazz dans une ambiance feutrée.",
                15.0f,
                l2,
                organisateur,
                setOf(teConcert),
                setOf(lc2)
        );

        Evenement ev3 = ensureEvenement(
                "Atelier de codage",
                ZonedDateTime.now().plusDays(3),
                ZonedDateTime.now().plusDays(3).plusHours(2),
                false,
                "Initiation à la programmation pour débutants.",
                0.0f,
                l3,
                organisateur,
                setOf(teAtelier),
                setOf(lc3)
        );

        // 8) Inscriptions (unicité logique utilisateur+évènement)
        ensureInscription(user,  ev1, ZonedDateTime.now().minusDays(1));
        ensureInscription(user,  ev2, ZonedDateTime.now().minusHours(12));
        ensureInscription(admin, ev3, ZonedDateTime.now());

        // 9) Paiements (unicité par référence)
        ensurePaiement("PAI123456", 25.0f, ZonedDateTime.now().minusDays(1),  user,  ev1);
        ensurePaiement("PAI123457", 15.0f, ZonedDateTime.now().minusHours(20), user,  ev2);
        ensurePaiement("PAI123458", 25.0f, ZonedDateTime.now().minusHours(6),  admin, ev1);

        System.out.println("[DataInit] Seed terminé sans doublons.");
    }

    // Petit utilitaire pour créer des sets en une ligne
    @SafeVarargs
    private static <T> Set<T> setOf(T... items) {
        return Arrays.stream(items).collect(Collectors.toCollection(LinkedHashSet::new));
    }
}

package com.evenix.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.evenix.dto.LoginRequest;
import com.evenix.dto.UtilisateurDTO;
import com.evenix.dto.request.RegistrationRequest;
import com.evenix.entities.Role;
import com.evenix.entities.Utilisateur;
import com.evenix.exception.EmailAlreadyExistsException; // Assurez-vous d'avoir créé cette exception ou utilisez IllegalArgumentException
import com.evenix.mappers.UtilisateurMapper;
import com.evenix.repos.RoleRepository;
import com.evenix.repos.UtilisateurRepository;
import com.evenix.security.SecParams;
import com.evenix.services.AuthService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    @Value("${evenix.jwt.secret}")
    private String jwtSecret;

    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UtilisateurRepository utilisateurRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==========================================
    // INSCRIPTION
    // ==========================================
    @Override
    public UtilisateurDTO register(RegistrationRequest request) {

        // 1. Vérification unicité email
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Cet email est déjà utilisé.");
        }

        Utilisateur u = new Utilisateur();
        u.setNom(request.getNom());
        u.setPrenom(request.getPrenom());
        u.setEmail(request.getEmail());
        u.setTelephone(request.getTelephone());
        u.setDateDeNaissance(request.getDateDeNaissance());
        u.setDateCreation(LocalDateTime.now());
        u.setEstConfirme(false); // Par défaut, en attente de validation (si implémenté)

        // 2. Hachage du mot de passe
        u.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));

        // 3. Gestion de la Sécurité (Question/Réponse)
        // On stocke la question en clair, mais la réponse est hachée comme un mot de passe !
        if (request.getQuestionSecurite() != null && request.getReponseSecurite() != null) {
            u.setQuestionSecurite(request.getQuestionSecurite());
            u.setReponseSecurite(passwordEncoder.encode(request.getReponseSecurite()));
        }

        // 4. Rôle par défaut : PARTICIPANT
        Role role = roleRepository.findByNom("PARTICIPANT")
                .orElseThrow(() -> new EntityNotFoundException("Rôle PARTICIPANT introuvable."));
        u.setRole(role);

        Utilisateur saved = utilisateurRepository.save(u);
        return UtilisateurMapper.fromEntity(saved);
    }

    // ==========================================
    // CONNEXION
    // ==========================================
    @Override
    public Utilisateur login(LoginRequest request) {
        Utilisateur u = utilisateurRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Email ou mot de passe incorrect."));

        if (!passwordEncoder.matches(request.getMotDePasse(), u.getMotDePasse())) {
            throw new IllegalArgumentException("Email ou mot de passe incorrect.");
        }
        return u;
    }

    // ==========================================
    // GÉNÉRATION TOKEN JWT
    // ==========================================
    @Override
    public String generateTokenFor(Utilisateur utilisateur) {
        // Le sujet DOIT être l'email (car UserDetailsService charge par email)
        String subject = utilisateur.getEmail(); 

        String roleName = "ROLE_USER"; 
        if (utilisateur.getRole() != null && utilisateur.getRole().getNom() != null) {
            String nom = utilisateur.getRole().getNom().toUpperCase();
            roleName = nom.startsWith("ROLE_") ? nom : "ROLE_" + nom;
        }

        return JWT.create()
                .withSubject(subject)
                .withArrayClaim("roles", new String[]{roleName})
                .withClaim("userId", utilisateur.getId()) // Pratique pour le front
                .withExpiresAt(new Date(System.currentTimeMillis() + SecParams.EXPIRATION_MS))
                .sign(Algorithm.HMAC256(jwtSecret));
    }

    // ==========================================
    // MOT DE PASSE OUBLIÉ
    // ==========================================


    public Map<String, String> getSecurityQuestion(String email) {
        Utilisateur u = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Aucun compte trouvé avec cet email."));

        if (u.getQuestionSecurite() == null || u.getQuestionSecurite().isEmpty()) {
            throw new IllegalArgumentException("Aucune question de sécurité n'a été configurée pour ce compte.");
        }

        return Map.of("question", u.getQuestionSecurite());
    }

    public void resetPassword(String email, String reponseSecurite, String nouveauMotDePasse) {
        Utilisateur u = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable."));

        // Vérification de la réponse secrète (comparaison de hachage)
        if (u.getReponseSecurite() == null || !passwordEncoder.matches(reponseSecurite, u.getReponseSecurite())) {
            throw new IllegalArgumentException("Réponse de sécurité incorrecte.");
        }

        // Mise à jour du mot de passe
        u.setMotDePasse(passwordEncoder.encode(nouveauMotDePasse));
        utilisateurRepository.save(u);
    }
}
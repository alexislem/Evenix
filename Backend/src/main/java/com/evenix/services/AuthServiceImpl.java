package com.evenix.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.evenix.dto.LoginRequest;
import com.evenix.dto.UtilisateurDTO;
import com.evenix.dto.request.RegistrationRequest;
import com.evenix.entities.Role;
import com.evenix.entities.Utilisateur;
import com.evenix.exception.EmailAlreadyExistsException;
import com.evenix.mappers.UtilisateurMapper;
import com.evenix.repos.RoleRepository;
import com.evenix.repos.UtilisateurRepository;
import com.evenix.security.SecParams;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    @Value("${evenix.jwt.secret}")
    private String jwtSecret;

    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;
    
    public AuthServiceImpl(UtilisateurRepository utilisateurRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==========================================
    // MÉTHODE PRIVÉE DE VALIDATION (Logic Identique React)
    // ==========================================
    private void validatePassword(String password) {
        if (password == null || password.length() < 12) {
            throw new IllegalArgumentException("Le mot de passe doit faire au moins 12 caractères.");
        }

        int lowerCount = 0;
        int upperCount = 0;
        int digitCount = 0;
        int specialCount = 0;
        
        String specialChars = "!@#$%^&*(),.?\":{}|<>";

        for (char c : password.toCharArray()) {
            if (Character.isLowerCase(c)) lowerCount++;
            else if (Character.isUpperCase(c)) upperCount++;
            else if (Character.isDigit(c)) digitCount++;
            else if (specialChars.indexOf(c) >= 0) specialCount++;
            
        }

        // --- RÈGLES ---
        if (lowerCount != 1) {
            throw new IllegalArgumentException("Le mot de passe doit contenir exactement 1 minuscule.");
        }
        if (specialCount < 1) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins 1 caractère spécial.");
        }
        
       
        if (password.length() != (lowerCount + upperCount + digitCount + specialCount)) {
             throw new IllegalArgumentException("Le mot de passe contient des caractères interdits (espaces...).");
        }
    }

    // ==========================================
    // INSCRIPTION
    // ==========================================
    @Override
    public UtilisateurDTO register(RegistrationRequest request) {


        validatePassword(request.getMotDePasse());

        // Vérification email existant
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Cet email est déjà utilisé.");
        }

        Utilisateur u = new Utilisateur();
        u.setNom(request.getNom());
        u.setPrenom(request.getPrenom());
        u.setEmail(request.getEmail());
        
        // Encodage 
        u.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        
        u.setTelephone(request.getTelephone());
        u.setDateDeNaissance(request.getDateDeNaissance());
        u.setDateCreation(LocalDateTime.now());
        u.setEstConfirme(false); 

        // Sécurité
        if (request.getQuestionSecurite() != null) {
            u.setQuestionSecurite(request.getQuestionSecurite());
            u.setReponseSecurite(passwordEncoder.encode(request.getReponseSecurite()));
        }

        // --- GESTION DU RÔLE ---
        final String roleCible = "ORGANISATEUR".equalsIgnoreCase(request.getRole()) 
                                ? "ORGANISATEUR" 
                                : "PARTICIPANT";

        Role role = roleRepository.findByNom(roleCible)
                .orElseThrow(() -> new EntityNotFoundException("Rôle " + roleCible + " introuvable en base."));
        u.setRole(role);

        // --- SUITE STANDARD ---
        String token = UUID.randomUUID().toString();
        u.setConfirmationToken(token);
        u.setTokenCreationDate(LocalDateTime.now());

        Utilisateur saved = utilisateurRepository.save(u);
        emailService.sendConfirmationEmail(saved.getEmail(), token);
        
        return UtilisateurMapper.fromEntity(saved);
    }
    
    @Override
    public Utilisateur login(LoginRequest request) {
        Utilisateur u = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Email ou mot de passe incorrect."));

        if (!passwordEncoder.matches(request.getMotDePasse(), u.getMotDePasse())) {
            throw new IllegalArgumentException("Email ou mot de passe incorrect.");
        }

        if (!Boolean.TRUE.equals(u.getEstConfirme())) {
            throw new IllegalArgumentException("Votre compte n'est pas confirmé. Veuillez vérifier vos emails.");
        }

        return u;
    }

    @Override
    public String generateTokenFor(Utilisateur utilisateur) {
        String subject = utilisateur.getEmail(); 

        String roleName = "ROLE_USER"; 
        if (utilisateur.getRole() != null && utilisateur.getRole().getNom() != null) {
            String nom = utilisateur.getRole().getNom().toUpperCase();
            roleName = nom.startsWith("ROLE_") ? nom : "ROLE_" + nom;
        }

        return JWT.create()
                .withSubject(subject)
                .withArrayClaim("roles", new String[]{roleName})
                .withClaim("userId", utilisateur.getId()) 
                .withExpiresAt(new Date(System.currentTimeMillis() + SecParams.EXPIRATION_MS))
                .sign(Algorithm.HMAC256(jwtSecret));
    }

    public Map<String, String> getSecurityQuestion(String email) {
         Utilisateur u = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Aucun compte trouvé avec cet email."));

        if (u.getQuestionSecurite() == null || u.getQuestionSecurite().isEmpty()) {
            throw new IllegalArgumentException("Aucune question de sécurité n'a été configurée pour ce compte.");
        }

        return Map.of("question", u.getQuestionSecurite());
    }

    @Override
    public void resetPassword(String email, String reponseSecurite, String nouveauMotDePasse) {
        // === AJOUT DE LA VALIDATION ICI AUSSI ===
        // Si l'utilisateur change son mot de passe, il faut aussi respecter les règles !
        validatePassword(nouveauMotDePasse); 

        Utilisateur u = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable."));

        if (!Boolean.TRUE.equals(u.getEstConfirme())) {
            throw new IllegalArgumentException("Votre compte n'est pas confirmé.");
        }

        if (u.getReponseSecurite() == null || !passwordEncoder.matches(reponseSecurite, u.getReponseSecurite())) {
            throw new IllegalArgumentException("Réponse de sécurité incorrecte.");
        }

        u.setMotDePasse(passwordEncoder.encode(nouveauMotDePasse));
        utilisateurRepository.save(u);
    }
    
    @Override
    public void confirmEmail(String token) {
        Utilisateur u = utilisateurRepository.findByConfirmationToken(token)
                .orElseThrow(() -> new EntityNotFoundException("Token invalide ou introuvable."));

        if (Boolean.TRUE.equals(u.getEstConfirme())) {
            throw new IllegalArgumentException("Ce compte est déjà confirmé.");
        }
        
        u.setEstConfirme(true);
        u.setConfirmationToken(null); 
        utilisateurRepository.save(u);
    }
}
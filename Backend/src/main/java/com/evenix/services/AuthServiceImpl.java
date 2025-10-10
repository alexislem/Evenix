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
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

  private static final String JWT_SECRET = "evenix-secret-change-me"; // ⚠️ aligne-le avec ton filtre
  private static final long   EXPIRATION_MS = 10L * 24 * 60 * 60 * 1000; // 10 jours

  private final UtilisateurRepository utilisateurRepository;
  private final RoleRepository roleRepository;
  private final BCryptPasswordEncoder passwordEncoder;

  public AuthServiceImpl(UtilisateurRepository utilisateurRepository,
                         RoleRepository roleRepository,
                         BCryptPasswordEncoder passwordEncoder) {
    this.utilisateurRepository = utilisateurRepository;
    this.roleRepository = roleRepository;
    this.passwordEncoder = passwordEncoder;
  }

  // ---------- REGISTER ----------
  @Override
  public UtilisateurDTO register(RegistrationRequest request) {

    if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
      throw new EmailAlreadyExistsException("Email déjà existant !");
    }


    Utilisateur u = new Utilisateur();
    u.setNom(request.getNom());
    u.setPrenom(request.getPrenom());
    u.setEmail(request.getEmail());
    u.setDateDeNaissance(request.getDateDeNaissance());
    u.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));


    Role role = resolveRole(request.getRoleId());
    u.setRole(role);


    Utilisateur saved = utilisateurRepository.save(u);
    return UtilisateurMapper.fromEntity(saved);
  }

  // ---------- LOGIN ----------
  @Override
  public Utilisateur login(LoginRequest request) {
    Utilisateur u = utilisateurRepository
        .findByEmail(request.getEmail())
        .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable"));

    if (!passwordEncoder.matches(request.getMotDePasse(), u.getMotDePasse())) {
      throw new IllegalArgumentException("Identifiants incorrects");
    }
    return u;
  }

  // ---------- JWT ----------
  @Override
  public String generateTokenFor(Utilisateur utilisateur) {
    String usernameSubject = utilisateur.getNom(); // sujet = username (ton écosystème l’utilise comme ça)
    String roleName = (utilisateur.getRole() != null && utilisateur.getRole().getNom() != null)
        ? "ROLE_" + utilisateur.getRole().getNom()
        : "ROLE_USER";

    return JWT.create()
        .withSubject(usernameSubject)
        .withArrayClaim("roles", new String[]{roleName})
        .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_MS))
        .sign(Algorithm.HMAC256(JWT_SECRET));
  }

  // ---------- Helpers ----------
  private Role resolveRole(int roleId) {
    // 1) Si un roleId est fourni, on le prend
    if (roleId > 0) {
      return roleRepository.findById(roleId)
          .orElseThrow(() -> new EntityNotFoundException("Rôle id=" + roleId + " introuvable"));
    }

    // 2) Sinon on tente le rôle par défaut "UTILISATEUR", sinon "USER"
    Optional<Role> byNom = roleRepository.findByNom("UTILISATEUR");
    if (byNom.isEmpty()) {
      byNom = roleRepository.findByNom("USER");
    }
    return byNom.orElseThrow(() -> new EntityNotFoundException("Rôle UTILISATEUR introuvable"));
  }
}

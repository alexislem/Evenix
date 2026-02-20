package com.evenix.security;

import com.evenix.entities.Role;
import com.evenix.entities.Utilisateur;
import com.evenix.repos.UtilisateurRepository; // On utilise le Repository directement
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MyUtilisateurDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    public MyUtilisateurDetailsService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // 1. On récupère l'ENTITÉ (qui contient le mot de passe haché) via le Repository
        // On ne passe pas par le Service car le Service renvoie un DTO sans mot de passe.
        Utilisateur u = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable : " + email));

        // 2. Gestion des Rôles et Autorités
        List<GrantedAuthority> auths = new ArrayList<>();
        Role r = u.getRole();
        
        if (r != null && r.getNom() != null && !r.getNom().isBlank()) {
            // Spring Security attend souvent le préfixe "ROLE_" pour les méthodes .hasRole()
            String nomRole = r.getNom().toUpperCase(); // On normalise en majuscules
            String authority = nomRole.startsWith("ROLE_") ? nomRole : "ROLE_" + nomRole;
            auths.add(new SimpleGrantedAuthority(authority));
        }

        // 3. Gestion de l'état du compte
        // Note: Si vous activez la confirmation par email, changez 'true' par 'u.getEstConfirme()'
        boolean enabled = true; 
        boolean accountNonExpired = true;
        boolean credentialsNonExpired = true;
        boolean accountNonLocked = true;

        // 4. Retourne l'objet User de Spring Security
        return new User(
                u.getEmail(),          // Username (ici l'email)
                u.getMotDePasse(),     // Password haché
                enabled,
                accountNonExpired,
                credentialsNonExpired,
                accountNonLocked,
                auths
        );
    }
}
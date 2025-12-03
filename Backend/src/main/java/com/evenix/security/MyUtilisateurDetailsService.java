package com.evenix.security;

import com.evenix.entities.Role;
import com.evenix.entities.Utilisateur;
import com.evenix.services.UtilisateurServiceImpl;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User; // Spring Security
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MyUtilisateurDetailsService implements UserDetailsService {

    private final UtilisateurServiceImpl utilisateurService;

    public MyUtilisateurDetailsService(UtilisateurServiceImpl utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Utilisateur u = utilisateurService.findUtilisateurByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable : " + email));

        List<GrantedAuthority> auths = new ArrayList<>();

        Role r = u.getRole();
        if (r != null && r.getNom() != null && !r.getNom().isBlank()) {
            String authority = r.getNom().startsWith("ROLE_") ? r.getNom() : "ROLE_" + r.getNom();
            auths.add(new SimpleGrantedAuthority(authority));
        }

        boolean enabled = true; // remplace par u.isEnabled() si tu l'as
        boolean accountNonExpired = true;
        boolean credentialsNonExpired = true;
        boolean accountNonLocked = true;

        return new User(
                u.getEmail(),          
                u.getMotDePasse(),     
                enabled,
                accountNonExpired,
                credentialsNonExpired,
                accountNonLocked,
                auths
        );
    }
}

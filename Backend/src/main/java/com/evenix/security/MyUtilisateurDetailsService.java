package com.evenix.security;

import com.evenix.entities.Role;
import com.evenix.entities.Utilisateur;
import com.evenix.services.UtilisateurService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User; // ⚠️ attention à l'import
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MyUtilisateurDetailsService implements UserDetailsService {

    private final UtilisateurService utilisateurService;

    public MyUtilisateurDetailsService(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        Utilisateur u = utilisateurService.findUtilisateurByNom(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable : " + username));

        List<GrantedAuthority> auths = new ArrayList<>();

        
        Role r = u.getRole();
        if (r != null && r.getNom() != null && !r.getNom().isBlank()) {
            String authority = r.getNom().startsWith("ROLE_") ? r.getNom() : "ROLE_" + r.getNom();
            auths.add(new SimpleGrantedAuthority(authority));
        }

        return new User(
                u.getNom(),         
                u.getMotDePasse(),  
                auths
        );
    }
}

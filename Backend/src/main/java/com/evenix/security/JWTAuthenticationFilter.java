package com.evenix.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.evenix.dto.UtilisateurDTO;
import com.evenix.entities.Utilisateur;
import com.evenix.repos.UtilisateurRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Algorithm algorithm;
    private final long expirationMs;

    private final UtilisateurRepository utilisateurRepository;

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager,
                                   String jwtSecret,
                                   long expirationMs,
                                   UtilisateurRepository utilisateurRepository) {
        this.authenticationManager = authenticationManager;
        this.algorithm = Algorithm.HMAC256(jwtSecret);
        this.expirationMs = expirationMs;
        this.utilisateurRepository = utilisateurRepository;

        setFilterProcessesUrl("/api/auth/login");
    }


    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
                                                HttpServletResponse response)
            throws AuthenticationException {

        try {
            JsonNode node = objectMapper.readTree(request.getInputStream());

            // On lit d'abord "email", sinon on retombe éventuellement sur username/nom
            String username = null;

            if (node.hasNonNull("email")) {
                username = node.get("email").asText();
            } else if (node.hasNonNull("username")) {
                username = node.get("username").asText();
            } else if (node.hasNonNull("nom")) {
                username = node.get("nom").asText();
            } else {
                username = "";
            }

            String password = node.hasNonNull("password") ? node.get("password").asText()
                             : node.path("motDePasse").asText();

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(username, password);

            return authenticationManager.authenticate(authToken);

        } catch (IOException e) {
            throw new RuntimeException("Impossible de lire le corps de la requête d'authentification", e);
        }
    }


    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain,
                                            Authentication authResult)
            throws IOException, ServletException {

        // User Spring Security
        var springUser = (org.springframework.security.core.userdetails.User) authResult.getPrincipal();

        // Rôles -> String[]
        List<String> roles = new ArrayList<>();
        springUser.getAuthorities().forEach(a -> roles.add(a.getAuthority()));

        // Génération du token
        String token = JWT.create()
                .withSubject(springUser.getUsername()) // ici : email
                .withArrayClaim("roles", roles.toArray(new String[0]))
                .withExpiresAt(new Date(System.currentTimeMillis() + expirationMs))
                .sign(algorithm);

        // 🔥 Récupération du vrai utilisateur (entité) depuis la base
        Utilisateur utilisateur = utilisateurRepository.findByEmail(springUser.getUsername())
                .orElse(null);

        // (optionnel mais recommandé) Conversion en DTO
        UtilisateurDTO utilisateurDTO = null;
        if (utilisateur != null) {
            utilisateurDTO = new UtilisateurDTO();
                utilisateurDTO.setId(utilisateur.getId());
                utilisateurDTO.setEmail(utilisateur.getEmail());
                utilisateurDTO.setNom(utilisateur.getNom());
                utilisateurDTO.setPrenom(utilisateur.getPrenom());
                utilisateurDTO.setRole(utilisateur.getRole());
        }

        // Construction de la réponse JSON
        Map<String, Object> body = new HashMap<>();
        body.put("token", token);
        body.put("utilisateur", utilisateurDTO);

        // Ajout optionnel du header Authorization
        response.addHeader(SecParams.HEADER, SecParams.PREFIX + token);

        // Envoi JSON
        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getWriter(), body);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request,
                                              HttpServletResponse response,
                                              AuthenticationException failed)
            throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\":\"Authentication failed\"}");
        response.getWriter().flush();
    }
}

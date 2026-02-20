package com.evenix.config;

import com.evenix.repos.UtilisateurRepository;
import com.evenix.security.JWTAuthorizationFilter;
import com.evenix.security.SecParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${evenix.jwt.secret}")
    private String jwtSecret;
    private final UtilisateurRepository utilisateurRepository;

    public SecurityConfig(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http,
                                    AuthenticationConfiguration authConfig) throws Exception {

        AuthenticationManager authMgr = authConfig.getAuthenticationManager();

        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));


        http
            .authorizeHttpRequests(auth -> auth
                // --- ROUTES PUBLIQUES (Tout le monde) ---
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/evenement/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/entreprise/all").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/lieu/all").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/type-evenement/all").permitAll()
                
                // --- AJOUT IMAGES/UPLOAD
                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll() // afficher les images
                .requestMatchers(HttpMethod.POST, "/api/uploads/**").hasAnyRole("ORGANISATEUR", "ADMIN") // uploader
                
                // ✅ AJOUT CRUCIAL : Autoriser l'affichage des erreurs pour tout le monde
                .requestMatchers("/error").permitAll()

                // --- UTILISATEURS ---
                .requestMatchers(HttpMethod.GET, "/api/utilisateur/all").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/utilisateur/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/utilisateur/**").authenticated()

                // --- GESTION ÉVÉNEMENTS ---
                .requestMatchers(HttpMethod.POST, "/api/evenement/**").hasAnyRole("ORGANISATEUR", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/evenement/**").hasAnyRole("ORGANISATEUR", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/evenement/**").hasAnyRole("ORGANISATEUR", "ADMIN")

                // --- AUTRES ---
                .requestMatchers(HttpMethod.POST, "/api/lieu/**").hasAnyRole("ORGANISATEUR", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/entreprise/**").hasRole("ADMIN")

                // --- CORS PREFLIGHT ---
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // --- TOUT LE RESTE ---
                .anyRequest().authenticated()
            );

        JWTAuthorizationFilter jwtAuthorizationFilter = new JWTAuthorizationFilter(jwtSecret);
        http.addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
            "http://localhost:5173","http://127.0.0.1:5173",
            "http://localhost:3000","http://127.0.0.1:3000"
        ));
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization","Content-Type","Accept","X-Requested-With"));
        config.setExposedHeaders(List.of(SecParams.HEADER,"Location"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
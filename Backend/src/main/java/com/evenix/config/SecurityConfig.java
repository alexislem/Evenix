package com.evenix.config;

import com.evenix.repos.UtilisateurRepository;
import com.evenix.security.JWTAuthenticationFilter;
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

                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/auth/confirm").permitAll() 
                .requestMatchers(HttpMethod.GET,  "/api/evenement/**").permitAll() 
                .requestMatchers(HttpMethod.GET,  "/api/entreprise/all").permitAll() 
                //.requestMatchers(HttpMethod.GET,  "/api/utilisateur/**").permitAll() 
                .requestMatchers("/api/utilisateur/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Exemple : si tu veux que la route de création utilisateur
                // passe uniquement par /api/auth/register :
                // on NE laisse pas /api/utilisateur public.
                // .requestMatchers(HttpMethod.POST, "/api/utilisateur").hasRole("ADMIN")
                // .requestMatchers(HttpMethod.GET,  "/api/utilisateur/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            );

        JWTAuthenticationFilter jwtAuthFilter =
                new JWTAuthenticationFilter(authMgr, jwtSecret, SecParams.EXPIRATION_MS,utilisateurRepository);

        http.addFilterAt(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

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
            // "https://evenix.fr" à ajouter ou nom de domaine correspondant pour nous
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

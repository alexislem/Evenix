package com.evenix.config;

import com.evenix.security.JWTAuthenticationFilter;
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

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http,
                                  AuthenticationConfiguration authConfig) throws Exception {

    http
      .csrf(csrf -> csrf.disable())
      .cors(Customizer.withDefaults())
      .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        // --- Routes publiques ---
        .requestMatchers("/login", "/api/auth/login").permitAll()
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

        // ✅ lecture publique de l'API événements
        .requestMatchers(HttpMethod.GET, "/api/evenement/**").permitAll()

        // --- le reste nécessite un JWT ---
        .anyRequest().authenticated()
      );

    AuthenticationManager authMgr = authConfig.getAuthenticationManager();
    JWTAuthenticationFilter jwtAuthFilter = new JWTAuthenticationFilter(authMgr);
    http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();

    // ✅ ORIGINES AUTORISÉES (MAMP + autres cas courants).
    // IMPORTANT : avec allowCredentials(true), chaque origine doit être listée EXACTEMENT (host + port).
    config.setAllowedOrigins(List.of(
      // Vite / React (si besoin)
      "http://localhost:5173", "http://127.0.0.1:5173",
      "http://localhost:3000", "http://127.0.0.1:3000",
      // Live Server VSCode (si besoin)
      "http://localhost:5500", "http://127.0.0.1:5500",
      // MAMP (les 2 ports les plus fréquents)
      "http://localhost",           // port 80
      "http://127.0.0.1",
      "http://localhost:8888",      // MAMP par défaut
      "http://127.0.0.1:8888",
      // Si tu ouvres des fichiers en file://
      "null"
    ));

    config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization","Content-Type","Accept","X-Requested-With","Origin"));
    config.setExposedHeaders(List.of("Authorization","Location"));
    config.setAllowCredentials(true); // on garde true car on liste des origines précises

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }
}

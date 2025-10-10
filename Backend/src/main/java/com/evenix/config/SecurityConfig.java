package com.evenix.config;

import com.evenix.security.JWTAuthenticationFilter;
import com.evenix.security.JWTAuthorizationFilter;
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
	    .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	    .csrf(csrf -> csrf.disable())
	    .cors(Customizer.withDefaults())
	    .authorizeHttpRequests(auth -> auth
	    		  .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
	    		  .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
	    		  .anyRequest().authenticated()
	    		);



	  AuthenticationManager authMgr = authConfig.getAuthenticationManager();
	  http.addFilterBefore(new JWTAuthenticationFilter(authMgr), UsernamePasswordAuthenticationFilter.class);
	  http.addFilterBefore(new JWTAuthorizationFilter(),        UsernamePasswordAuthenticationFilter.class);

	  return http.build();
	}


	@Bean
	CorsConfigurationSource corsConfigurationSource() {
	  CorsConfiguration config = new CorsConfiguration();
	  config.setAllowedOrigins(List.of(
	    "http://localhost:5173","http://127.0.0.1:5173",
	    "http://localhost:3000","http://127.0.0.1:3000",
	    "http://localhost:4200","http://127.0.0.1:4200"   // ⬅️ Angular dev server
	  ));
	  config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
	  config.setAllowedHeaders(List.of("*")); // ou liste précise
	  config.setExposedHeaders(List.of("Authorization","Location")); // ⬅️ pour lire le JWT côté front
	  config.setAllowCredentials(true); // seulement si tu envoies des cookies; ok aussi avec JWT header

	  UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	  source.registerCorsConfiguration("/**", config);
	  return source;
	}

}

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

    /*http
      .csrf(csrf -> csrf.disable())
      .cors(Customizer.withDefaults())
      .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/login", "/api/auth/login","/register**").permitAll()
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .anyRequest().authenticated()
      );
*/
	  
	  http
	    .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	    .csrf(csrf -> csrf.disable())
	    .cors(Customizer.withDefaults())
	    .authorizeHttpRequests(auth -> auth
	      .requestMatchers("/api/auth/**").permitAll()
	      .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
	      .anyRequest().authenticated()
	    );

   /* AuthenticationManager authMgr = authConfig.getAuthenticationManager();


    JWTAuthenticationFilter jwtAuthFilter = new JWTAuthenticationFilter(authMgr);

    http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
*/
	  
	  AuthenticationManager authMgr = authConfig.getAuthenticationManager();
	  http.addFilterBefore(new JWTAuthenticationFilter(authMgr), UsernamePasswordAuthenticationFilter.class);
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
    config.setExposedHeaders(List.of("Authorization","Location"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }
}

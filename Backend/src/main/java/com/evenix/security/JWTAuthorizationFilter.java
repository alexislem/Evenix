package com.evenix.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

public class JWTAuthorizationFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {

    String jwt = request.getHeader(SecParams.HEADER); 
    if (jwt == null || !jwt.startsWith(SecParams.PREFIX)) {
      filterChain.doFilter(request, response);
      return;
    }


    String token = jwt.substring(SecParams.PREFIX.length());

    try {
      var verifier = JWT.require(Algorithm.HMAC256(SecParams.SECRET)).build();
      var decoded  = verifier.verify(token);

      String username = decoded.getSubject();
      List<String> roles = decoded.getClaim("roles").asList(String.class); // ex: ["ROLE_ADMIN"]

      var authorities = roles == null
          ? List.<SimpleGrantedAuthority>of()
          : roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());

      var auth = new UsernamePasswordAuthenticationToken(username, null, authorities);
      SecurityContextHolder.getContext().setAuthentication(auth);

      filterChain.doFilter(request, response);
    } catch (Exception e) {
      SecurityContextHolder.clearContext();
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.setContentType("application/json");
      response.getWriter().write("{\"error\":\"Invalid or expired token\"}");
      response.getWriter().flush();
    }
  }
}

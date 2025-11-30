// com.evenix.security.JWTAuthorizationFilter
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
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

public class JWTAuthorizationFilter extends OncePerRequestFilter {

  private final Algorithm algo;

  public JWTAuthorizationFilter(String secret) {
    this.algo = Algorithm.HMAC256(secret);
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {


    String header = request.getHeader(SecParams.HEADER);

    if (!StringUtils.hasText(header) || !header.startsWith(SecParams.PREFIX)) {

      filterChain.doFilter(request, response);
      return;
    }


    String token = header.substring(SecParams.PREFIX.length());

    try {
      var verifier = JWT.require(algo).build();
      var decoded = verifier.verify(token);

      String username = decoded.getSubject();
      String[] roles = decoded.getClaim("roles").asArray(String.class);

      Collection<SimpleGrantedAuthority> authorities =
          (roles == null)
              ? java.util.List.of()
              : Arrays.stream(roles)
                      .map(SimpleGrantedAuthority::new)
                      .collect(Collectors.toList());

      var authentication =
          new UsernamePasswordAuthenticationToken(username, null, authorities);

      SecurityContextHolder.getContext().setAuthentication(authentication);


      filterChain.doFilter(request, response);

    } catch (Exception ex) {

      SecurityContextHolder.clearContext();
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");

    }
  }
}

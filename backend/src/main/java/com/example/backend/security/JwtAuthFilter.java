package com.example.backend.security;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.backend.service.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthFilter extends OncePerRequestFilter {

  private static final String PREFIXO = "Bearer ";

  private final JwtService jwtService;

  public JwtAuthFilter(JwtService jwtService) {
    this.jwtService = jwtService;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain chain) throws ServletException, IOException {
    String header = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (header !=  null && header.startsWith(PREFIXO)
          && SecurityContextHolder.getContext().getAuthentication() == null) {
        try {
          Claims claims = jwtService.validarToken(header.substring(PREFIXO.length()));
          String perfil = claims.get("perfil", String.class);
          var autenticacao = new UsernamePasswordAuthenticationToken(
                  claims.getSubject(),
                  null,
                  List.of(new SimpleGrantedAuthority("ROLE_" + perfil)));
          SecurityContextHolder.getContext().setAuthentication(autenticacao);
        } catch (JwtException | IllegalArgumentException ex) {
          SecurityContextHolder.clearContext();
        }
      }
      chain.doFilter(request, response);          
  }
}

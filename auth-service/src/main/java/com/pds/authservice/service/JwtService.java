package com.pds.authservice.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class JwtService {

    @Value("${jwt.secret:your-secret-key-change-this-in-production-with-at-least-256-bits}")
    private String secretKey;

    @Value("${jwt.expiration:86400000}") // 24 heures par défaut
    private long jwtExpiration;

    @Value("${jwt.refresh-expiration:604800000}") // 7 jours par défaut
    private long refreshExpiration;

    /**
     * Générer un JWT token
     */
    public String generateToken(Long userId, String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", userId);
        return createToken(claims, email, jwtExpiration);
    }

    /**
     * Générer un refresh token
     */
    public String generateRefreshToken(Long userId, String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        return createToken(claims, email, refreshExpiration);
    }

    /**
     * Créer un token
     */
    private String createToken(Map<String, Object> claims, String subject, long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

        return Jwts.builder()
                .claims(claims)  // Nouvelle méthode pour JJWT 0.12.3
                .subject(subject)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key, io.jsonwebtoken.Jwts.SIG.HS256)  // Nouvelle façon de spécifier l'algorithme
                .compact();
    }

    /**
     * Extraire l'email du token
     */
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * Extraire le rôle du token
     */
    public String extractRole(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    /**
     * Extraire l'ID utilisateur du token
     */
    public Long extractUserId(String token) {
        Object userId = extractAllClaims(token).get("userId");
        if (userId instanceof Integer) {
            return ((Integer) userId).longValue();
        }
        return (Long) userId;
    }

    /**
     * Vérifier si le token est expiré
     */
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = extractAllClaims(token).getExpiration();
            return expiration.before(new Date());
        } catch (Exception e) {
            log.warn("Erreur lors de la vérification d'expiration du token", e);
            return true;
        }
    }

    /**
     * Valider le token
     */
    public boolean validateToken(String token, String email) {
        try {
            String tokenEmail = extractEmail(token);
            return (tokenEmail.equals(email)) && !isTokenExpired(token);
        } catch (Exception e) {
            log.warn("Erreur lors de la validation du token", e);
            return false;
        }
    }

    /**
     * Valider le token sans vérifier l'email
     */
    public boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            log.warn("Erreur lors de la validation du token", e);
            return false;
        }
    }

    /**
     * Extraire tous les claims du token
     */
    private Claims extractAllClaims(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
            return Jwts.parser()
                    .verifyWith(key)  // Nouvelle méthode pour JJWT 0.12.3
                    .build()
                    .parseSignedClaims(token)  // Nouvelle méthode
                    .getPayload();
        } catch (Exception e) {
            log.warn("Erreur lors de l'extraction des claims du token", e);
            throw new RuntimeException("Token invalide", e);
        }
    }

    /**
     * Extraire la date d'expiration
     */
    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    /**
     * Extraire la date d'émission
     */
    public Date extractIssuedAt(String token) {
        return extractAllClaims(token).getIssuedAt();
    }
}
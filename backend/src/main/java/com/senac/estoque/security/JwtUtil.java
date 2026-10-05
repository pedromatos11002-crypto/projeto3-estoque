package com.senac.estoque.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Locale;

@Component
public class JwtUtil {

    public static String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "";
        }

        String normalized = role.trim().toUpperCase(Locale.ROOT);
        normalized = normalized.replace("ROLE_", "");

        if ("ADMINISTRADOR".equals(normalized)) {
            return "ADMIN";
        }

        return normalized;
    }

    private final Key key;
    private final long expirationMs;

    public JwtUtil(Environment env) {
        String secret = env.getProperty("JWT_SECRET");
        if (secret == null || secret.isBlank()) {
            // In production this must be set; for build/test we still create a key
            secret = "default-secret-do-not-use-in-production-please-set-JWT_SECRET";
        }

        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        String exp = env.getProperty("JWT_EXPIRATION_MS", "3600000");
        this.expirationMs = Long.parseLong(exp);
    }

    public String generateToken(String username, String role, Long userId, String name) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        String normalizedRole = normalizeRole(role);

        return Jwts.builder()
                .setSubject(username)
                .claim("role", normalizedRole)
                .claim("userId", userId)
                .claim("name", name)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> validateToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }
}

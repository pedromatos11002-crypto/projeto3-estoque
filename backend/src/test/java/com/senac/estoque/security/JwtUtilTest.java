package com.senac.estoque.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class JwtUtilTest {

    @Test
    void normalizeRole_acceptsAdminAliases() {
        assertEquals("ADMIN", JwtUtil.normalizeRole("ADMIN"));
        assertEquals("ADMIN", JwtUtil.normalizeRole("ROLE_ADMIN"));
        assertEquals("ADMIN", JwtUtil.normalizeRole("ADMINISTRADOR"));
        assertEquals("FUNCIONARIO", JwtUtil.normalizeRole("ROLE_FUNCIONARIO"));
    }
}

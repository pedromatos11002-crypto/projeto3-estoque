package com.senac.estoque.controller;

import com.senac.estoque.model.Usuario;
import com.senac.estoque.security.JwtUtil;
import com.senac.estoque.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioService usuarioService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UsuarioService usuarioService, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public static class LoginRequest {
        public String email;
        public String senha;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        return usuarioService.porEmail(req.email).map(user -> {
            if (passwordEncoder.matches(req.senha, user.getSenha())) {
                String token = jwtUtil.generateToken(user.getEmail(), user.getPerfil(), user.getId(), user.getNome());
                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "user", Map.of("id", user.getId(), "nome", user.getNome(), "email", user.getEmail(), "perfil", user.getPerfil())
                ));
            } else {
                return ResponseEntity.status(401).body(Map.of("message", "Email ou senha inválidos."));
            }
        }).orElse(ResponseEntity.status(401).body(Map.of("message", "Email ou senha inválidos.")));
    }
}

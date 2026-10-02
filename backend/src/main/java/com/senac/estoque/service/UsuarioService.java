package com.senac.estoque.service;

import com.senac.estoque.model.Usuario;
import com.senac.estoque.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario criar(Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> porEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public List<Usuario> listarTodos() { return usuarioRepository.findAll(); }

    public Optional<Usuario> porId(Long id) { return usuarioRepository.findById(id); }

    public void excluir(Long id) { usuarioRepository.deleteById(id); }

    public Usuario atualizar(Long id, Usuario u) {
        return usuarioRepository.findById(id).map(existing -> {
            existing.setNome(u.getNome());
            existing.setEmail(u.getEmail());
            if (u.getSenha() != null && !u.getSenha().isBlank()) {
                existing.setSenha(passwordEncoder.encode(u.getSenha()));
            }
            existing.setPerfil(u.getPerfil());
            return usuarioRepository.save(existing);
        }).orElseThrow();
    }
}

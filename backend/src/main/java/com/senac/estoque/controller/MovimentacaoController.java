package com.senac.estoque.controller;

import com.senac.estoque.model.Movimentacao;
import com.senac.estoque.service.MovimentacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movimentacoes")
@CrossOrigin(origins = "*")
public class MovimentacaoController {

    private final MovimentacaoService movimentacaoService;

    public MovimentacaoController(MovimentacaoService movimentacaoService) {
        this.movimentacaoService = movimentacaoService;
    }

    @GetMapping
    public List<Movimentacao> listar() {
        return movimentacaoService.listarTodas();
    }

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Movimentacao movimentacao) {
        try {
            Movimentacao m = movimentacaoService.registrar(movimentacao);
            return ResponseEntity.ok(m);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        }
    }
}

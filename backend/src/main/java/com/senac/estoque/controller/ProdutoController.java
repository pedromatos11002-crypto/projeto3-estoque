package com.senac.estoque.controller;

import com.senac.estoque.model.Produto;
import com.senac.estoque.service.ProdutoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public List<Produto> listar() {
        return produtoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Produto buscarPorId(@PathVariable Long id) {
        return produtoService.buscarPorId(id);
    }

    @GetMapping("/estoque-baixo")
    public List<Produto> estoqueBaixo() {
        return produtoService.listarComEstoqueBaixo();
    }

    @GetMapping("/valor-total")
    public Map<String, Double> valorTotal() {
        return Map.of("valorTotal", produtoService.calcularValorTotalEmEstoque());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Produto criar(@RequestBody Produto produto) {
        return produtoService.salvar(produto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Produto atualizar(@PathVariable Long id, @RequestBody Produto produto) {
        return produtoService.atualizar(id, produto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void excluir(@PathVariable Long id) {
        produtoService.excluir(id);
    }
}

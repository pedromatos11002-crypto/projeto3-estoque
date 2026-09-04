package com.senac.estoque.service;

import com.senac.estoque.model.Movimentacao;
import com.senac.estoque.model.Produto;
import com.senac.estoque.model.TipoMovimentacao;
import com.senac.estoque.repository.MovimentacaoRepository;
import com.senac.estoque.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovimentacaoService {

    private final MovimentacaoRepository movimentacaoRepository;
    private final ProdutoRepository produtoRepository;

    public MovimentacaoService(MovimentacaoRepository movimentacaoRepository, ProdutoRepository produtoRepository) {
        this.movimentacaoRepository = movimentacaoRepository;
        this.produtoRepository = produtoRepository;
    }

    public List<Movimentacao> listarTodas() {
        return movimentacaoRepository.findAll();
    }

    @Transactional
    public Movimentacao registrar(Movimentacao mov) {
        if (mov.getQuantidade() == null || mov.getQuantidade() <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser maior que zero.");
        }

        Produto produto = produtoRepository.findById(mov.getProdutoId()).orElseThrow();

        if (mov.getTipo() == TipoMovimentacao.SAIDA) {
            // Verifica estoque suficiente antes de dar saída
            if (produto.getQuantidadeEstoque() == null || produto.getQuantidadeEstoque() < mov.getQuantidade()) {
                throw new IllegalArgumentException("Estoque insuficiente. Estoque disponível: " + (produto.getQuantidadeEstoque() == null ? 0 : produto.getQuantidadeEstoque()));
            }
            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - mov.getQuantidade());
        } else if (mov.getTipo() == TipoMovimentacao.ENTRADA) {
            // Soma a quantidade de entrada
            Integer atual = produto.getQuantidadeEstoque() == null ? 0 : produto.getQuantidadeEstoque();
            produto.setQuantidadeEstoque(atual + mov.getQuantidade());
        }

        produtoRepository.save(produto);

        mov.setData(LocalDateTime.now());
        return movimentacaoRepository.save(mov);
    }
}

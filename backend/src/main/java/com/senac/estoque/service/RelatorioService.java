package com.senac.estoque.service;

import com.senac.estoque.model.Relatorio;
import com.senac.estoque.repository.RelatorioRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RelatorioService {

    private final RelatorioRepository relatorioRepository;

    public RelatorioService(RelatorioRepository relatorioRepository) {
        this.relatorioRepository = relatorioRepository;
    }

    public List<Relatorio> listarTodos() {
        return relatorioRepository.findAll(Sort.by(Sort.Direction.DESC, "dataGeracao"));
    }

    public Relatorio salvar(MultipartFile arquivo, String nome) throws IOException {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new IllegalArgumentException("Arquivo PDF obrigatório.");
        }

        String nomeRelatorio = (nome == null || nome.isBlank()) ? "Relatório" : nome.trim();

        Relatorio relatorio = new Relatorio();
        relatorio.setNome(nomeRelatorio);
        relatorio.setDataGeracao(LocalDateTime.now());
        relatorio.setMimeType(arquivo.getContentType() != null ? arquivo.getContentType() : "application/pdf");
        relatorio.setTamanhoBytes((long) arquivo.getSize());
        relatorio.setConteudoPdf(arquivo.getBytes());

        return relatorioRepository.save(relatorio);
    }

    public Relatorio buscarPorId(Long id) {
        return relatorioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Relatório não encontrado."));
    }

    public void excluir(Long id) {
        relatorioRepository.deleteById(id);
    }
}

package com.senac.estoque.controller;

import com.senac.estoque.model.Relatorio;
import com.senac.estoque.service.RelatorioService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/relatorios")
@CrossOrigin(origins = "*")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    public static class RelatorioResumoDto {
        private Long id;
        private String nome;
        private String dataGeracao;
        private Long tamanhoBytes;

        public RelatorioResumoDto(Long id, String nome, String dataGeracao, Long tamanhoBytes) {
            this.id = id;
            this.nome = nome;
            this.dataGeracao = dataGeracao;
            this.tamanhoBytes = tamanhoBytes;
        }

        public Long getId() {
            return id;
        }

        public String getNome() {
            return nome;
        }

        public String getDataGeracao() {
            return dataGeracao;
        }

        public Long getTamanhoBytes() {
            return tamanhoBytes;
        }
    }

    @GetMapping
    public List<RelatorioResumoDto> listar() {
        return relatorioService.listarTodos().stream()
                .map(relatorio -> new RelatorioResumoDto(
                        relatorio.getId(),
                        relatorio.getNome(),
                        relatorio.getDataGeracao().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                        relatorio.getTamanhoBytes()))
                .toList();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> salvar(
            @RequestParam("arquivo") MultipartFile arquivo,
            @RequestParam(value = "nome", required = false) String nome
    ) {
        try {
            Relatorio relatorio = relatorioService.salvar(arquivo, nome);
            return ResponseEntity.ok(Map.of(
                    "id", relatorio.getId(),
                    "nome", relatorio.getNome(),
                    "dataGeracao", relatorio.getDataGeracao().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                    "tamanhoBytes", relatorio.getTamanhoBytes()
            ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        } catch (IOException ex) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Erro ao salvar PDF."));
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        Relatorio relatorio = relatorioService.buscarPorId(id);

        String nomeArquivo = relatorio.getNome();
        if (!nomeArquivo.toLowerCase().endsWith(".pdf")) {
            nomeArquivo = nomeArquivo + ".pdf";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nomeArquivo + "\"")
                .body(relatorio.getConteudoPdf());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        relatorioService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}

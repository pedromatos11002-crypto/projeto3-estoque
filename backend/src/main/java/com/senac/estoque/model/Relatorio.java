package com.senac.estoque.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "relatorios")
public class Relatorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(name = "data_geracao", nullable = false)
    private LocalDateTime dataGeracao;

    @Column(name = "mime_type", nullable = false)
    private String mimeType;

    @Column(name = "tamanho_bytes", nullable = false)
    private Long tamanhoBytes;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "conteudo_pdf", nullable = false)
    private byte[] conteudoPdf;

    public Relatorio() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDateTime getDataGeracao() {
        return dataGeracao;
    }

    public void setDataGeracao(LocalDateTime dataGeracao) {
        this.dataGeracao = dataGeracao;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public Long getTamanhoBytes() {
        return tamanhoBytes;
    }

    public void setTamanhoBytes(Long tamanhoBytes) {
        this.tamanhoBytes = tamanhoBytes;
    }

    public byte[] getConteudoPdf() {
        return conteudoPdf;
    }

    public void setConteudoPdf(byte[] conteudoPdf) {
        this.conteudoPdf = conteudoPdf;
    }
}

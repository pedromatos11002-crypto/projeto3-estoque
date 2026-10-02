package com.senac.estoque.service;

import com.senac.estoque.model.Categoria;
import com.senac.estoque.repository.CategoriaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
class CategoriaServiceTest {

    @Autowired
    private CategoriaService categoriaService;

    @MockBean
    private CategoriaRepository categoriaRepository;

    @Test
    void deveAtualizarCategoriaExistente() {
        Categoria existente = new Categoria(1L, "Antiga");
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(categoriaRepository.save(any(Categoria.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Categoria categoriaAtualizada = categoriaService.atualizar(1L, "Nova");

        assertEquals("Nova", categoriaAtualizada.getNome());
        verify(categoriaRepository).save(existente);
    }
}

package com.senac.estoque.config;

import com.senac.estoque.model.Categoria;
import com.senac.estoque.model.Usuario;
import com.senac.estoque.model.Produto;
import com.senac.estoque.repository.CategoriaRepository;
import com.senac.estoque.repository.ProdutoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final ProdutoRepository produtoRepository;
    private final com.senac.estoque.repository.UsuarioRepository usuarioRepository;
    private final org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder passwordEncoder;

    public DataLoader(CategoriaRepository categoriaRepository, ProdutoRepository produtoRepository, com.senac.estoque.repository.UsuarioRepository usuarioRepository, org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder passwordEncoder) {
        this.categoriaRepository = categoriaRepository;
        this.produtoRepository = produtoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (categoriaRepository.count() == 0) {
            Categoria c1 = categoriaRepository.save(new Categoria(null, "Informatica"));
            Categoria c2 = categoriaRepository.save(new Categoria(null, "Papelaria"));

            Produto p1 = new Produto();
            p1.setNome("Mouse sem fio");
            p1.setDescricao("Mouse otico USB");
            p1.setPrecoUnitario(45.90);
            p1.setQuantidadeEstoque(20);
            p1.setEstoqueMinimo(5);
            p1.setCategoriaId(c1.getId());
            produtoRepository.save(p1);

            Produto p2 = new Produto();
            p2.setNome("Caderno universitario");
            p2.setDescricao("200 folhas");
            p2.setPrecoUnitario(18.50);
            p2.setQuantidadeEstoque(4);
            p2.setEstoqueMinimo(10);
            p2.setCategoriaId(c2.getId());
            produtoRepository.save(p2);

            Produto p3 = new Produto();
            p3.setNome("Teclado mecanico");
            p3.setDescricao("ABNT2 RGB");
            p3.setPrecoUnitario(199.90);
            p3.setQuantidadeEstoque(8);
            p3.setEstoqueMinimo(8);
            p3.setCategoriaId(c1.getId());
            produtoRepository.save(p3);
        }

        // Create initial admin user if env vars present and no users exist
        if (usuarioRepository.count() == 0) {
            String adminEmail = System.getenv("ADMIN_EMAIL");
            String adminPassword = System.getenv("ADMIN_PASSWORD");
            String adminName = System.getenv("ADMIN_NAME");

            if (adminEmail != null && adminPassword != null) {
                Usuario admin = new Usuario();
                admin.setNome(adminName != null ? adminName : "Admin");
                admin.setEmail(adminEmail);
                admin.setSenha(passwordEncoder.encode(adminPassword));
                admin.setPerfil("ADMIN");
                usuarioRepository.save(admin);
            }
        }

        // Ensure default admin account exists (first-login general): admin@localhost / admin123
        try {
            String defaultEmail = "admin@localhost";
            if (usuarioRepository.findByEmail(defaultEmail).isEmpty()) {
                Usuario admin = new Usuario();
                admin.setNome("Administrador");
                admin.setEmail(defaultEmail);
                admin.setSenha(passwordEncoder.encode("admin123"));
                admin.setPerfil("ADMIN");
                usuarioRepository.save(admin);
            }
        } catch (Exception ex) {
            // Do not fail startup if creating default admin fails; log if logger available
        }
    }
}

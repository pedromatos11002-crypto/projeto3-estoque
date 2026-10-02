import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { get, del } from '../services/api'

export default function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    carregar()

    get('/categorias')
      .then(setCategorias)
      .catch((erro) => {
        console.error('Erro ao carregar categorias:', erro)
      })
  }, [])

  function carregar() {
    get('/produtos')
      .then(setProdutos)
      .catch((erro) => {
        console.error('Erro ao carregar produtos:', erro)
      })
  }

  function nomeCategoria(categoriaId) {
    const categoria = categorias.find(
      (categoria) => categoria.id === categoriaId
    )

    return categoria ? categoria.nome : '(sem categoria)'
  }

  function excluir(id) {
    const confirmar = window.confirm(
      'Deseja realmente excluir este produto?'
    )

    if (!confirmar) {
      return
    }

    del(`/produtos/${id}`)
      .then(() => {
        carregar()
      })
      .catch((erro) => {
        console.error('Erro ao excluir produto:', erro)
        alert('Não foi possível excluir o produto.')
      })
  }

  function formatarPreco(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  return (
    <div>
      <div className="space-between mb-12">
        <h1>Produtos</h1>

        <Link
          to="/produtos/novo"
          className="btn btn-primary"
          style={{ textDecoration: 'none' }}
        >
          Novo produto
        </Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {produtos.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>
                  Nenhum produto cadastrado.
                </td>
              </tr>
            ) : (
              produtos.map((produto) => {
                const estoqueBaixo =
                  Number(produto.quantidadeEstoque || 0) <
                  Number(produto.estoqueMinimo || 0)

                return (
                  <tr
                    key={produto.id}
                    className={estoqueBaixo ? 'low-stock' : ''}
                  >
                    <td>{produto.nome}</td>

                    <td>
                      {nomeCategoria(produto.categoriaId)}
                    </td>

                    <td>
                      R$ {formatarPreco(produto.precoUnitario)}
                    </td>

                    <td>
                      {produto.quantidadeEstoque}
                    </td>

                    <td>
                      <Link
                        to={`/produtos/${produto.id}/editar`}
                        className="btn btn-secondary"
                        style={{
                          textDecoration: 'none',
                          marginRight: '8px'
                        }}
                      >
                        Editar
                      </Link>

                      <button
                        className="btn btn-danger"
                        onClick={() => excluir(produto.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
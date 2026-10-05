import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { get, del } from '../services/api'

export default function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [searchParams] = useSearchParams()

  const busca = (searchParams.get('busca') || '').toLowerCase().trim()

  useEffect(() => {
    carregarProdutos()
    carregarCategorias()
  }, [])

  function carregarProdutos() {
    get('/produtos')
      .then((dados) => {
        console.log('Produtos carregados:', dados)
        setProdutos(Array.isArray(dados) ? dados : [])
      })
      .catch((erro) => {
        console.error('Erro ao carregar produtos:', erro)
        setProdutos([])
      })
  }

  function carregarCategorias() {
    get('/categorias')
      .then((dados) => {
        console.log('Categorias carregadas:', dados)
        setCategorias(Array.isArray(dados) ? dados : [])
      })
      .catch((erro) => {
        console.error('Erro ao carregar categorias:', erro)
        setCategorias([])
      })
  }

  function nomeCategoria(categoriaId) {
    const categoria = categorias.find(
      (categoria) =>
        String(categoria.id) === String(categoriaId)
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
        carregarProdutos()
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

  const produtosFiltrados = produtos.filter((produto) => {
    if (!busca) {
      return true
    }

    const nome = String(produto.nome || '').toLowerCase()

    const descricao = String(
      produto.descricao || ''
    ).toLowerCase()

    const categoria = String(
      nomeCategoria(produto.categoriaId)
    ).toLowerCase()

    return (
      nome.includes(busca) ||
      descricao.includes(busca) ||
      categoria.includes(busca)
    )
  })

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

      {busca && (
        <div
          style={{
            marginBottom: '15px',
            padding: '12px',
            borderRadius: '8px'
          }}
        >
          Resultados para:{' '}
          <strong>{busca}</strong>

          <span style={{ marginLeft: '10px' }}>
            ({produtosFiltrados.length} produto
            {produtosFiltrados.length !== 1 ? 's' : ''})
          </span>
        </div>
      )}

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

            {produtosFiltrados.length === 0 ? (

              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: 'center',
                    padding: '30px'
                  }}
                >
                  {busca
                    ? `Nenhum produto encontrado para "${busca}".`
                    : 'Nenhum produto cadastrado.'}
                </td>
              </tr>

            ) : (

              produtosFiltrados.map((produto) => {

                const estoqueBaixo =
                  Number(produto.quantidadeEstoque || 0) <
                  Number(produto.estoqueMinimo || 0)

                return (
                  <tr
                    key={produto.id}
                    className={
                      estoqueBaixo ? 'low-stock' : ''
                    }
                  >

                    <td>
                      {produto.nome}
                    </td>

                    <td>
                      {nomeCategoria(
                        produto.categoriaId
                      )}
                    </td>

                    <td>
                      R${' '}
                      {formatarPreco(
                        produto.precoUnitario
                      )}
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
                        onClick={() =>
                          excluir(produto.id)
                        }
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
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { get, del } from '../services/api'

export default function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    carregar()
    get('/categorias').then(setCategorias)
  }, [])

  function carregar() {
    get('/produtos').then(setProdutos)
  }

  function nomeCategoria(categoriaId) {
    const cat = categorias.find((c) => c.id === categoriaId)
    return cat ? cat.nome : '(sem categoria)'
  }

  function excluir(id) {
    if (window.confirm('Deseja realmente excluir este produto?')) {
      del(`/produtos/${id}`).then(carregar)
    }
  }

  return (
    <div>
      <div className="space-between mb-12">
        <h1>Produtos</h1>
        <Link to="/produtos/novo"><button className="btn btn-primary">Novo produto</button></Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Nome</th><th>Categoria</th><th>Preco</th><th>Estoque</th><th>Acoes</th></tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id} className={p.quantidadeEstoque < p.estoqueMinimo ? 'low-stock' : ''}>
                <td>{p.nome}</td>
                <td>{nomeCategoria(p.categoriaId)}</td>
                {/* BUG: concatenacao manual em vez de formatacao de moeda */}
                <td>R$ {p.precoUnitario}</td>
                <td>{p.quantidadeEstoque}</td>
                <td>
                  <Link to={`/produtos/${p.id}/editar`} className="btn btn-secondary" style={{ textDecoration: 'none' }}>Editar</Link>{' '}
                  <button className="btn btn-danger" onClick={() => excluir(p.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

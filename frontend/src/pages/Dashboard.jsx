import { useEffect, useState } from 'react'
import { get } from '../services/api'

export default function Dashboard() {
  const [produtos, setProdutos] = useState([])

  useEffect(() => {
    get('/produtos').then(setProdutos)
  }, [])

  // Use os dados atuais dos produtos para calcular os indicadores
  const valorTotal = produtos.reduce((sum, p) => sum + ((Number(p.precoUnitario) || 0) * (Number(p.quantidadeEstoque) || 0)), 0)
  const estoqueBaixo = produtos.filter((p) => (Number(p.quantidadeEstoque) || 0) <= (Number(p.estoqueMinimo) || 0))

  return (
    <div>
      <h1>Painel de Estoque</h1>
      <div className="grid">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Produtos cadastrados</div>
              <div className="stat">{produtos.length}</div>
            </div>
            <div className="card-icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 3.87 3.13 7 7 7s7-3.13 7-7c0-3.87-3.13-7-7-7z" fill="currentColor" opacity="0.16"/><path d="M12 11a3 3 0 100-6 3 3 0 000 6z" fill="currentColor"/></svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Valor total em estoque</div>
              <div className="stat">R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="card-icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14v8H5z" fill="currentColor" opacity="0.12"/><path d="M7 10h10v2H7z" fill="currentColor"/></svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Produtos com estoque baixo</div>
              <div className="stat">{estoqueBaixo.length}</div>
            </div>
            <div className="card-icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3 6h6l-5 4 2 6-6-4-6 4 2-6L3 8h6z" fill="currentColor" opacity="0.12"/><path d="M12 7l1.5 3H10.5L12 7z" fill="currentColor"/></svg>
            </div>
          </div>
        </div>
      </div>

      <h2>Alerta de estoque baixo</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Produto</th><th>Estoque</th><th>Minimo</th></tr></thead>
          <tbody>
            {estoqueBaixo.map((p) => (
              <tr key={p.id}><td>{p.nome}</td><td>{p.quantidadeEstoque}</td><td>{p.estoqueMinimo}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

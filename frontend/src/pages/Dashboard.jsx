import { useEffect, useState } from 'react'
import { get } from '../services/api'

export default function Dashboard() {
  const [produtos, setProdutos] = useState([])

  useEffect(() => {
    get('/produtos')
      .then(setProdutos)
      .catch((error) => {
        console.error('Erro ao carregar produtos:', error)
      })
  }, [])

  const valorTotal = produtos.reduce(
    (sum, p) =>
      sum +
      (Number(p.precoUnitario) || 0) *
        (Number(p.quantidadeEstoque) || 0),
    0
  )

  const estoqueBaixo = produtos.filter(
    (p) =>
      (Number(p.quantidadeEstoque) || 0) <=
      (Number(p.estoqueMinimo) || 0)
  )

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Painel de Estoque</h1>
          <p className="muted">
            Acompanhe os principais indicadores do seu estoque.
          </p>
        </div>
      </div>

      <div className="grid dashboard-cards">
        <div className="card dashboard-card">
          <div className="card-head">
            <div>
              <div className="card-title">Produtos cadastrados</div>
              <div className="stat">{produtos.length}</div>
            </div>

            <div className="card-icon" aria-hidden="true">
              📦
            </div>
          </div>
        </div>

        <div className="card dashboard-card">
          <div className="card-head">
            <div>
              <div className="card-title">Valor total em estoque</div>
              <div className="stat dashboard-value">
                R${' '}
                {valorTotal.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="card-icon" aria-hidden="true">
              💰
            </div>
          </div>
        </div>

        <div className="card dashboard-card">
          <div className="card-head">
            <div>
              <div className="card-title">
                Produtos com estoque baixo
              </div>
              <div className="stat">{estoqueBaixo.length}</div>
            </div>

            <div className="card-icon warning-icon" aria-hidden="true">
              ⚠️
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Alertas de estoque baixo</h2>
            <p className="muted">
              Produtos que precisam de reposição.
            </p>
          </div>
        </div>

        {estoqueBaixo.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">✓</div>
            <h3>Estoque em dia</h3>
            <p className="muted">
              Nenhum produto está abaixo do estoque mínimo.
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Estoque atual</th>
                  <th>Estoque mínimo</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {estoqueBaixo.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.nome}</strong>
                    </td>

                    <td>{p.quantidadeEstoque}</td>

                    <td>{p.estoqueMinimo}</td>

                    <td>
                      <span className="stock-badge">
                        Estoque baixo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
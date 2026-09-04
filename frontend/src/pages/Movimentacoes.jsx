import { useEffect, useState } from 'react'
import { get, post } from '../services/api'

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([])
  const [produtos, setProdutos] = useState([])
  const [form, setForm] = useState({ produtoId: '', tipo: 'SAIDA', quantidade: 1, observacao: '' })
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    carregar()
    get('/produtos').then(setProdutos)
  }, [])

  function carregar() {
    get('/movimentacoes').then(setMovimentacoes)
  }

  function handleSubmit(e) {
    e.preventDefault()
    // Evita duplo envio rápido
    if (enviando) return
    setEnviando(true)
    post('/movimentacoes', form).then(() => {
      carregar()
      get('/produtos').then(setProdutos)
    }).catch((err) => {
      console.error('Erro ao registrar movimentacao', err)
      alert('Não foi possível registrar a movimentação.')
    }).finally(() => setEnviando(false))
  }

  return (
    <div>
      <h1>Movimentacoes de Estoque</h1>
      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <div className="field">
              <label>Produto</label>
              <select value={form.produtoId} onChange={(e) => setForm({ ...form, produtoId: e.target.value })}>
                <option value="">Selecione...</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome} (estoque: {p.quantidadeEstoque})</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                <option value="ENTRADA">Entrada</option>
                <option value="SAIDA">Saida</option>
              </select>
            </div>
          </div>

          <div>
            <div className="field">
              <label>Quantidade</label>
              <input type="number" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: e.target.value })} />
            </div>
            <div className="field">
              <label>Observacao</label>
              <input value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} />
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <button type="submit" className="btn btn-primary">Registrar</button>
        </div>
      </form>

      <div className="table-wrap movements-card" style={{ marginTop: 16 }}>
        <table className="movement-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Tipo</th>
              <th>Quantidade</th>
              <th>Data</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(movimentacoes) && movimentacoes.map((m) => {
              const produto = produtos.find((p) => p.id === m.produtoId)
              const produtoNome = produto ? produto.nome : m.produtoId
              const date = m.data ? new Date(m.data) : null
              const pad = (n) => String(n).padStart(2, '0')
              const formattedDate = date ? `${pad(date.getDate())}/${pad(date.getMonth()+1)}/${date.getFullYear()} às ${pad(date.getHours())}:${pad(date.getMinutes())}` : '-'
              return (
                <tr key={m.id} className="movement-row">
                  <td className="movement-product">{produtoNome}</td>
                  <td className="movement-type">
                    {m.tipo === 'ENTRADA' ? (
                      <span className="type-badge entrada"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Entrada</span>
                    ) : (
                      <span className="type-badge saida"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Saída</span>
                    )}
                  </td>
                  <td className="movement-qty"><span className="qty-pill">{m.quantidade}</span></td>
                  <td className="movement-date">{formattedDate}</td>
                  <td className="movement-obs">{m.observacao ? <span className="obs-text">{m.observacao}</span> : <span className="muted">-</span>}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

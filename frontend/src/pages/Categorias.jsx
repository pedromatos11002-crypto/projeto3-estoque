import { useEffect, useState } from 'react'
import { get, post, del } from '../services/api'

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [nome, setNome] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    carregar()
  }, [])

  function carregar() {
    get('/categorias')
      .then((data) => setCategorias(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Erro carregando categorias', err)
        setCategorias([])
      })
  }

  async function criar(e) {
    e.preventDefault()
    const valor = (nome || '').trim()
    if (!valor) {
      alert('O nome da categoria não pode ficar vazio.')
      return
    }
    // evita duplicacao no frontend (caso backend nao force)
    if (categorias.some((c) => c.nome && c.nome.toLowerCase() === valor.toLowerCase())) {
      alert('Categoria já existe.')
      return
    }
    setEnviando(true)
    try {
      const nova = await post('/categorias', { nome: valor })
      // se o backend retornar a categoria criada, adiciona direto; senao, recarrega
      if (nova && nova.id) {
        setCategorias((prev) => [...prev, nova])
      } else {
        await carregar()
      }
      setNome('')
    } catch (err) {
      console.error('Erro ao criar categoria', err)
      alert('Não foi possível criar a categoria: ' + (err.message || err))
    } finally {
      setEnviando(false)
    }
  }

  async function excluir(id) {
    if (!id) {
      alert('ID da categoria inválido.')
      return
    }
    if (!window.confirm('Deseja realmente excluir esta categoria?')) return
    setDeletingId(id)
    try {
      await del(`/categorias/${id}`)
      // remover localmente sem recarregar toda a lista
      setCategorias((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      console.error('Erro ao excluir categoria', err)
      alert('Não foi possível excluir a categoria: ' + (err.message || err))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="space-between mb-12">
        <h1>Categorias</h1>
      </div>

      <form className="card form-card" onSubmit={criar}>
        <div className="field">
          <label>Nome da categoria</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="space-between">
          <div />
          <button type="submit" className="btn btn-primary" disabled={enviando}>{enviando ? 'Adicionando...' : 'Adicionar'}</button>
        </div>
      </form>

      <div className="table-wrap" style={{ marginTop: 16 }}>
        <table>
          <thead><tr><th>Nome</th><th>Acoes</th></tr></thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => excluir(c.id)} disabled={deletingId === c.id}>
                    {deletingId === c.id ? 'Excluindo...' : 'Excluir'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

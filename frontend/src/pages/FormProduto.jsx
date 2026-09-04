import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { get, post, put } from '../services/api'

export default function FormProduto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState({
    nome: '', descricao: '', precoUnitario: '', quantidadeEstoque: 0, estoqueMinimo: 0, categoriaId: '',
  })
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    get('/categorias').then(setCategorias)
    if (id) {
      get(`/produtos/${id}`).then(setForm)
    }
  }, [id])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    console.log('handleSubmit executado')
    console.log('ID:', id)

    // prepare payload: convert numbers and normalize decimal comma
    const payload = {
      ...form,
      precoUnitario: form.precoUnitario === '' ? 0 : parseFloat(String(form.precoUnitario).replace(',', '.')),
      estoqueMinimo: parseInt(form.estoqueMinimo || 0, 10) || 0,
      quantidadeEstoque: parseInt(form.quantidadeEstoque === '' ? NaN : form.quantidadeEstoque, 10),
      categoriaId: form.categoriaId === '' ? null : (isNaN(Number(form.categoriaId)) ? form.categoriaId : Number(form.categoriaId)),
    }

    console.log('Payload:', payload)

    if (payload.precoUnitario < 0) {
      alert('O preço não pode ser negativo.')
      return
    }

    if (!Number.isInteger(payload.quantidadeEstoque) || payload.quantidadeEstoque < 0 || isNaN(payload.quantidadeEstoque)) {
      alert('A quantidade em estoque deve ser um número inteiro não-negativo.')
      setEnviando(false)
      return
    }

    setEnviando(true)
    try {
      if (id) {
        console.log('Enviando PUT para /produtos/' + id)
        await put(`/produtos/${id}`, payload)
      } else {
        console.log('Enviando POST para /produtos')
        await post('/produtos', payload)
      }
      navigate('/produtos')
    } catch (err) {
      console.error('Erro ao salvar/criar produto', err)
      alert('Não foi possível salvar o produto: ' + (err.message || err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div>
      <h1>{id ? 'Editar Produto' : 'Novo Produto'}</h1>
      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div>
            <div className="field">
              <label>Nome</label>
              <input name="nome" value={form.nome} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Descricao</label>
              <input name="descricao" value={form.descricao} onChange={handleChange} />
            </div>
          </div>

          <div>
            <div className="field">
              <label>Preco unitario</label>
              <input type="number" step="0.01" name="precoUnitario" value={form.precoUnitario} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Quantidade em estoque</label>
              <input type="number" step="1" min="0" name="quantidadeEstoque" value={form.quantidadeEstoque} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Estoque minimo</label>
              <input type="number" min="0" name="estoqueMinimo" value={form.estoqueMinimo} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Categoria</label>
              <select name="categoriaId" value={form.categoriaId} onChange={handleChange}>
                <option value="">Selecione...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={enviando}>{enviando ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </form>
    </div>
  )
}

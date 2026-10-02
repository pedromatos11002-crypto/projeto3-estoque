import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as auth from '../services/auth'

function BoxIcon() {
  return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 21 31.5 8 56 20.5v27L32 59 8 46V21Z"/><path d="m8.5 20.5 23.5 13 24-13M32 34v24M20 14.5l24 13v14"/></svg>
}
function MailIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg> }
function LockIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/></svg> }
function EyeIcon({ hidden }) { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/>{hidden && <path d="m4 4 16 16"/>}</svg> }

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaVisivel, setSenhaVisivel] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError(null)
    const em = (email || '').trim()
    if (!em) return setError('Informe o e-mail.')
    setLoading(true)
    try {
      const res = await auth.login(em, senha)
      if (res?.token) navigate('/')
      else setError('E-mail ou senha inválidos.')
    } catch (err) {
      console.error(err)
      if (err.message?.toLowerCase().includes('401')) setError('E-mail ou senha inválidos.')
      else setError('Não foi possível conectar ao servidor.')
    } finally { setLoading(false) }
  }

  return <main className="login-page">
    <section className="login-card" aria-labelledby="login-title">
      <div className="login-brand-icon"><BoxIcon /></div>
      <h1 id="login-title">SISTEMA DE <span>ESTOQUE</span></h1>
      <p className="login-subtitle">Acesse sua conta para continuar</p>
      <form onSubmit={submit}>
        <div className="login-field">
          <label htmlFor="login-email">E-mail</label>
          <div className="login-input-wrap"><MailIcon /><input id="login-email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" /></div>
        </div>
        <div className="login-field">
          <label htmlFor="login-password">Senha</label>
          <div className="login-input-wrap"><LockIcon /><input id="login-password" type={senhaVisivel ? 'text' : 'password'} autoComplete="current-password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Digite sua senha" /><button className="password-toggle" type="button" onClick={() => setSenhaVisivel(!senhaVisivel)} aria-label={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}><EyeIcon hidden={senhaVisivel} /></button></div>
        </div>
        {error && <div className="login-error" role="alert">{error}</div>}
        <button className="login-submit" type="submit" disabled={loading}>{loading ? 'Entrando...' : <>Entrar <span aria-hidden="true">→</span></>}</button>
      </form>
    </section>
  </main>
}

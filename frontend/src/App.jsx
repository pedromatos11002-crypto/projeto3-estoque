import {
  Routes,
  Route,
  NavLink,
  Link,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom'

import { useEffect, useState } from 'react'

import './senac-theme.css'

import Dashboard from './pages/DashboardModern.jsx'
import Graficos from './pages/Graficos.jsx'
import Produtos from './pages/Produtos.jsx'
import FormProduto from './pages/FormProduto.jsx'
import Categorias from './pages/Categorias.jsx'
import Movimentacoes from './pages/Movimentacoes.jsx'
import LoginPage from './pages/LoginPage.jsx'

import * as auth from './services/auth'

const links = [
  { to: '/', label: 'Dashboard', icon: '⌂', end: true },
  { to: '/produtos', label: 'Produtos', icon: '▣' },
  { to: '/categorias', label: 'Categorias', icon: '▤' },
  { to: '/movimentacoes', label: 'Movimentacoes', icon: '↕' },
  { to: '/graficos', label: 'Relatorios', icon: '▥' }
]

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Carrega o tema salvo
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('tema') === 'dark'
  })

  const closeMenu = () => setMenuOpen(false)

  const user = auth.getUser()
  const isAuth = auth.isAuthenticated()

  // Aplica o tema no site
  useEffect(() => {
    document.body.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    )

    localStorage.setItem(
      'tema',
      darkMode ? 'dark' : 'light'
    )
  }, [darkMode])

  function alternarTema() {
    setDarkMode((valorAtual) => !valorAtual)
  }

  if (!isAuth) {
    return (
      <div className="login-shell">
        <Routes>
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="*"
            element={<Navigate to="/login" />}
          />
        </Routes>
      </div>
    )
  }

  function pesquisar(e) {
    const valor = e.target.value

    setSearch(valor)

    if (valor.trim()) {
      navigate(
        `/produtos?busca=${encodeURIComponent(valor)}`
      )
    } else {
      navigate('/produtos')
    }
  }

  return (
    <div className="app-shell">

      {/* Botão do menu mobile */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menu"
      >
        ☰
      </button>

      {/* MENU LATERAL */}
      <aside
        className={`sidebar ${
          menuOpen ? 'sidebar-open' : ''
        }`}
      >
        <Link
          to="/"
          className="brand"
          onClick={closeMenu}
        >
          <span className="brand-mark">
            <svg viewBox="0 0 64 64" width="30" height="30" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"><path d="M8 21 31.5 8 56 20.5v27L32 59 8 46V21Z"/><path d="m8.5 20.5 23.5 13 24-13M32 34v24M20 14.5l24 13v14"/></svg>
          </span>

          <span className="brand-copy">
            Estoque
            <small>Master</small>
          </span>
        </Link>

        <nav className="sidebar-nav">
          {links.map(
            ({ to, label, icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `nav-link ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                <span className="nav-icon">
                  {icon}
                </span>

                {label}
              </NavLink>
            )
          )}
        </nav>

        <div className="sidebar-profile">
          <div className="avatar">
            PH
          </div>

          <div>
            <strong>
              {user?.nome || 'Usuário'}
            </strong>

            <small>
              {user?.perfil || ''}
            </small>
          </div>
        </div>

        <button
          className="logout-button"
          type="button"
          onClick={() => {
            auth.logout()
            window.location.href = '/login'
          }}
        >
          <span>↪</span>
          Sair
        </button>
      </aside>

      {menuOpen && (
        <button
          className="sidebar-scrim"
          onClick={closeMenu}
          aria-label="Fechar menu"
        />
      )}

      {/* ÁREA PRINCIPAL */}
      <main className="main-area">

        {/* BARRA SUPERIOR */}
        <header className="topbar">

          <div className="global-search">
            <span>⌕</span>

            <input
              aria-label="Buscar"
              placeholder="Buscar produtos, categorias..."
              value={search}
              onChange={pesquisar}
            />
          </div>

          <div className="topbar-user">

            {/* BOTÃO DE TEMA */}
            <button
              className="theme-toggle"
              type="button"
              onClick={alternarTema}
              aria-label={
                darkMode
                  ? 'Ativar modo claro'
                  : 'Ativar modo escuro'
              }
              title={
                darkMode
                  ? 'Modo claro'
                  : 'Modo escuro'
              }
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* NOTIFICAÇÕES */}
            <button
              className="notification"
              aria-label="Notificacoes"
            >
              ♧<i />
            </button>

            <div className="avatar avatar-small">
              PH
            </div>

            <span>
              {user?.nome || 'Usuário'}
            </span>

            <span className="chevron">
              ⌄
            </span>

          </div>
        </header>

        {/* CONTEÚDO */}
        <div className="page-content">

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/graficos"
              element={<Graficos />}
            />

            <Route
              path="/produtos"
              element={<Produtos />}
            />

            <Route
              path="/produtos/novo"
              element={<FormProduto />}
            />

            <Route
              path="/produtos/:id/editar"
              element={<FormProduto />}
            />

            <Route
              path="/categorias"
              element={<Categorias />}
            />

            <Route
              path="/movimentacoes"
              element={<Movimentacoes />}
            />

          </Routes>

        </div>

      </main>

    </div>
  )
}

export default App

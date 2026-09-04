import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import Produtos from './pages/Produtos.jsx'
import FormProduto from './pages/FormProduto.jsx'
import Categorias from './pages/Categorias.jsx'
import Movimentacoes from './pages/Movimentacoes.jsx'

function App() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div>
      <nav className="app-nav">
        <div className="nav-inner">
          <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
            <svg className="logo" width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="6" y="30" width="20" height="18" rx="3" fill="#8FBFA3" />
              <rect x="38" y="30" width="20" height="18" rx="3" fill="#78a88f" />
              <rect x="22" y="10" width="20" height="18" rx="3" fill="#DCEDE2" />
              <path d="M22 10 L32 2 L42 10" stroke="#8FBFA3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Estoque</span>
          </Link>

          <div className={`nav-items ${menuOpen ? 'show' : ''}`}>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/produtos" className={`nav-link ${location.pathname.startsWith('/produtos') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Produtos</Link>
            <Link to="/categorias" className={`nav-link ${location.pathname.startsWith('/categorias') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Categorias</Link>
            <Link to="/movimentacoes" className={`nav-link ${location.pathname.startsWith('/movimentacoes') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Movimentacoes</Link>
          </div>

          <button className="nav-toggle" onClick={() => setMenuOpen((s) => !s)} aria-label="Abrir menu">☰</button>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produtos/novo" element={<FormProduto />} />
          <Route path="/produtos/:id/editar" element={<FormProduto />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/movimentacoes" element={<Movimentacoes />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

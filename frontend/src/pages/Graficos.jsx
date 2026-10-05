import { useEffect, useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'
import { BASE_URL, get } from '../services/api'

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0))

const formatPeriodLabel = (dateValue) => {
  if (!dateValue) return 'Sem data'
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return 'Sem data'
  return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
}

export default function Graficos() {
  const [produtos, setProdutos] = useState([])
  const [movimentacoes, setMovimentacoes] = useState([])
  const [relatoriosSalvos, setRelatoriosSalvos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [salvandoRelatorio, setSalvandoRelatorio] = useState(false)
  const [mensagemRelatorio, setMensagemRelatorio] = useState('')
  const [erroRelatorio, setErroRelatorio] = useState('')
  const [gerandoPdf, setGerandoPdf] = useState(false)

  const carregarRelatoriosSalvos = async () => {
    try {
      const dados = await get('/relatorios')
      setRelatoriosSalvos(Array.isArray(dados) ? dados : [])
    } catch (err) {
      console.error('Erro carregando relatórios salvos:', err)
      setRelatoriosSalvos([])
    }
  }

  useEffect(() => {
    Promise.all([
      get('/produtos'),
      get('/movimentacoes'),
    ])
      .then(([produtosData, movimentacoesData]) => {
        setProdutos(Array.isArray(produtosData) ? produtosData : [])
        setMovimentacoes(Array.isArray(movimentacoesData) ? movimentacoesData : [])
      })
      .catch((err) => {
        console.error('Erro carregando dados para gráficos', err)
        setProdutos([])
        setMovimentacoes([])
      })
      .finally(() => {
        setCarregando(false)
      })

    carregarRelatoriosSalvos()
  }, [])

  const entradasTotais = useMemo(
    () => movimentacoes
      .filter((m) => String(m.tipo || '').toUpperCase() === 'ENTRADA')
      .reduce((sum, m) => sum + (Number(m.quantidade) || 0), 0),
    [movimentacoes]
  )

  const saidasTotais = useMemo(
    () => movimentacoes
      .filter((m) => String(m.tipo || '').toUpperCase() === 'SAIDA')
      .reduce((sum, m) => sum + (Number(m.quantidade) || 0), 0),
    [movimentacoes]
  )

  const totalEstoque = useMemo(
    () => produtos.reduce((sum, produto) => sum + ((Number(produto.precoUnitario) || 0) * (Number(produto.quantidadeEstoque) || 0)), 0),
    [produtos]
  )

  const periodos = useMemo(() => {
    const dadosPorPeriodo = new Map()

    movimentacoes.forEach((m) => {
      if (!m.data) return
      const data = new Date(m.data)
      if (Number.isNaN(data.getTime())) return

      const key = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
      const existente = dadosPorPeriodo.get(key) || {
        key,
        label: formatPeriodLabel(`${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-01T00:00:00`),
        entrada: 0,
        saida: 0,
      }

      const tipo = String(m.tipo || '').toUpperCase()
      if (tipo === 'ENTRADA') existente.entrada += Number(m.quantidade) || 0
      if (tipo === 'SAIDA') existente.saida += Number(m.quantidade) || 0

      dadosPorPeriodo.set(key, existente)
    })

    return Array.from(dadosPorPeriodo.values()).sort((a, b) => a.key.localeCompare(b.key)).slice(-6)
  }, [movimentacoes])

  const maiorValorPeriodo = Math.max(1, ...periodos.flatMap((item) => [item.entrada, item.saida]))

  const hasFinanceData = useMemo(() => {
    if (!Array.isArray(produtos) || produtos.length === 0) return false

    const financeKeys = ['precoCusto', 'precoCompra', 'custoUnitario', 'valorCompra', 'precoVenda', 'valorVenda', 'preco', 'venda']
    return produtos.some((produto) =>
      Object.keys(produto || {}).some((key) => financeKeys.includes(key))
    )
  }, [produtos])

  const baixarBlob = (blob, nomeArquivo) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = nomeArquivo
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const salvarRelatorioNoBackend = async (blob, nomeArquivo) => {
    const formData = new FormData()
    formData.append('arquivo', blob, nomeArquivo)
    formData.append('nome', nomeArquivo)

    const token = localStorage.getItem('auth_token')
    const resposta = await fetch(`${BASE_URL}/relatorios`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })

    const texto = await resposta.text()
    if (!resposta.ok) {
      throw new Error(texto || 'Erro ao salvar relatório.')
    }

    try {
      return texto ? JSON.parse(texto) : null
    } catch {
      return null
    }
  }

  const baixarRelatorioSalvo = async (id, nome) => {
    const token = localStorage.getItem('auth_token')
    const resposta = await fetch(`${BASE_URL}/relatorios/${id}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })

    if (!resposta.ok) {
      throw new Error('Não foi possível baixar o relatório salvo.')
    }

    const blob = await resposta.blob()
    const nomeArquivo = nome.toLowerCase().endsWith('.pdf') ? nome : `${nome}.pdf`
    baixarBlob(blob, nomeArquivo)
  }

  const excluirRelatorioSalvo = async (id) => {
    const token = localStorage.getItem('auth_token')
    const resposta = await fetch(`${BASE_URL}/relatorios/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })

    if (!resposta.ok) {
      throw new Error('Não foi possível excluir o relatório salvo.')
    }

    await carregarRelatoriosSalvos()
  }

  const gerarPdf = async () => {
    setGerandoPdf(true)
    setSalvandoRelatorio(true)
    setMensagemRelatorio('')
    setErroRelatorio('')

    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' })
      const dataGeracao = new Date().toLocaleDateString('pt-BR')
      const dia = String(new Date().getDate()).padStart(2, '0')
      const nomeArquivo = `relatorio-${dia}.pdf`

      const linhas = [
        'SISTEMA INTEGRADO DE GESTÃO DA QUALIDADE',
        'Relatório: Gráficos',
        `Data de geração: ${dataGeracao}`,
        '',
        `Entradas: ${entradasTotais}`,
        `Saídas: ${saidasTotais}`,
        `Valor total do estoque: ${formatCurrency(totalEstoque)}`,
        '',
        'Períodos:',
      ]

      periodos.forEach((periodo) => {
        linhas.push(`- ${periodo.label}: entradas ${periodo.entrada}, saídas ${periodo.saida}`)
      })

      if (periodos.length === 0) {
        linhas.push('- Sem dados de movimentação para exibir por período.')
      }

      linhas.push('', 'Resultado financeiro:')
      linhas.push(hasFinanceData ? 'Disponível / calculado' : 'Não calculável com os dados atuais')

      if (!hasFinanceData) {
        linhas.push('O cálculo de lucro/prejuízo real não pode ser realizado com os dados atuais do sistema.')
      }

      let cursorY = 60
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.text(linhas[0], 40, cursorY)

      cursorY += 28
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)

      linhas.slice(1).forEach((linha) => {
        if (cursorY > 760) {
          doc.addPage()
          cursorY = 60
        }

        doc.text(linha, 40, cursorY)
        cursorY += 18
      })

      const pdfBlob = doc.output('blob')
      baixarBlob(pdfBlob, nomeArquivo)
      await salvarRelatorioNoBackend(pdfBlob, nomeArquivo)
      await carregarRelatoriosSalvos()
      setMensagemRelatorio('PDF gerado e salvo com sucesso.')
    } catch (error) {
      console.error('Erro ao gerar PDF do relatório:', error)
      setErroRelatorio('Não foi possível gerar ou salvar o PDF do relatório.')
    } finally {
      setGerandoPdf(false)
      setSalvandoRelatorio(false)
    }
  }

  return (
    <div className="graficos-page">
      <style>{`
        .graficos-page h1 { margin: 0 0 20px; }
        .graficos-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
        .graficos-header h1 { margin: 0; }
        .graficos-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; margin-bottom: 24px; }
        .saved-reports { display: grid; gap: 12px; }
        .saved-report { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border: 1px solid #edf3ef; border-radius: 12px; background: #f8faf9; }
        .saved-report-meta { display: flex; flex-direction: column; gap: 4px; }
        .saved-report-name { font-weight: 700; }
        .saved-report-date { color: var(--muted); font-size: 12px; }
        .saved-report-actions { display: flex; gap: 8px; }
        .saved-report-actions .btn { min-width: 110px; }
        .relatorio-status { margin-top: 12px; font-size: 13px; }
        .relatorio-status.success { color: #1f7a4d; }
        .relatorio-status.error { color: #b23a3a; }
        .graficos-card { background: var(--card); border-radius: 14px; box-shadow: var(--shadow); padding: 22px; }
        .graficos-card .label { font-size: 13px; color: var(--muted); font-weight: 700; margin-bottom: 8px; }
        .graficos-card .valor { font-size: 28px; font-weight: 800; color: var(--text); }
        .graficos-card .sub { margin-top: 8px; color: var(--muted); font-size: 13px; }
        .graficos-panel { background: var(--card); border-radius: 14px; box-shadow: var(--shadow); padding: 22px; margin-bottom: 24px; }
        .graficos-panel h2 { margin: 0 0 18px; font-size: 1.2rem; }
        .chart-wrap { display: flex; align-items: end; gap: 14px; min-height: 220px; padding-top: 12px; }
        .chart-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .bars { display: flex; align-items: end; justify-content: center; gap: 6px; height: 160px; width: 100%; }
        .bar { width: 26px; border-radius: 8px 8px 0 0; min-height: 4px; }
        .bar-entrada { background: linear-gradient(180deg, #7ea88e, #8FBFA3); }
        .bar-saida { background: linear-gradient(180deg, #d89a9a, #D98282); }
        .chart-label { color: var(--muted); font-size: 12px; text-align: center; }
        .result-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
        .result-box { border-radius: 12px; padding: 18px; background: #f7faf8; border: 1px solid #edf3ef; }
        .result-box .title { color: var(--muted); font-weight: 700; font-size: 13px; }
        .result-box .value { margin-top: 10px; font-size: 24px; font-weight: 800; }
        .result-info { margin-top: 18px; color: var(--muted); font-size: 14px; line-height: 1.5; }
        @media (max-width: 720px) {
          .chart-wrap { overflow-x: auto; }
          .chart-col { min-width: 70px; }
        }
      `}</style>

      <div className="graficos-header">
        <h1>Gráficos</h1>
        {!carregando && (
          <button
            type="button"
            className="btn btn-primary"
            disabled={gerandoPdf || salvandoRelatorio}
            onClick={gerarPdf}
          >
            {gerandoPdf || salvandoRelatorio ? 'Gerando PDF...' : 'Gerar PDF'}
          </button>
        )}
      </div>

      {mensagemRelatorio && (
        <div className="relatorio-status success">{mensagemRelatorio}</div>
      )}
      {erroRelatorio && (
        <div className="relatorio-status error">{erroRelatorio}</div>
      )}

      {carregando ? (
        <div className="graficos-panel">Carregando dados...</div>
      ) : (
        <>
          <div className="graficos-grid">
            <div className="graficos-card">
              <div className="label">Entradas</div>
              <div className="valor">{entradasTotais}</div>
              <div className="sub">Quantidade total registrada como entrada</div>
            </div>

            <div className="graficos-card">
              <div className="label">Saídas</div>
              <div className="valor">{saidasTotais}</div>
              <div className="sub">Quantidade total registrada como saída</div>
            </div>

            <div className="graficos-card">
              <div className="label">Valor total do estoque</div>
              <div className="valor">{formatCurrency(totalEstoque)}</div>
              <div className="sub">Baseado em preço unitário × quantidade em estoque</div>
            </div>
          </div>

          <div className="graficos-panel">
            <h2>Entradas x saídas</h2>

            {periodos.length > 0 ? (
              <div className="chart-wrap">
                {periodos.map((periodo) => (
                  <div className="chart-col" key={periodo.key}>
                    <div className="bars">
                      <div className="bar bar-entrada" style={{ height: `${Math.max((periodo.entrada / maiorValorPeriodo) * 100, 6)}%` }} title={`Entradas: ${periodo.entrada}`} />
                      <div className="bar bar-saida" style={{ height: `${Math.max((periodo.saida / maiorValorPeriodo) * 100, 6)}%` }} title={`Saídas: ${periodo.saida}`} />
                    </div>
                    <div className="chart-label">{periodo.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="sub">Sem dados de movimentação com data suficiente para agrupar por período.</div>
            )}
          </div>

          <div className="graficos-panel">
            <h2>Resultado financeiro</h2>
            <div className="result-grid">
              <div className="result-box">
                <div className="title">Lucro</div>
                <div className="value" style={{ color: '#2d7a45' }}>{hasFinanceData ? 'Disponível' : 'Não calculável'}</div>
              </div>

              <div className="result-box">
                <div className="title">Prejuízo</div>
                <div className="value" style={{ color: '#9b2b2b' }}>{hasFinanceData ? 'Disponível' : 'Não calculável'}</div>
              </div>

              <div className="result-box">
                <div className="title">Resultado</div>
                <div className="value" style={{ color: '#26332B' }}>{hasFinanceData ? 'Calculado' : 'Neutro'}</div>
              </div>
            </div>

            {!hasFinanceData && (
              <div className="result-info">
                O cálculo de lucro/prejuízo real não pode ser realizado com os dados atuais do sistema, porque não existem informações de custo de compra, preço de venda ou dados financeiros suficientes para comparar entradas e saídas por valor.
              </div>
            )}
          </div>

          <div className="graficos-panel">
            <h2>Relatórios salvos</h2>
            {relatoriosSalvos.length === 0 ? (
              <div className="sub">Nenhum relatório salvo no sistema.</div>
            ) : (
              <div className="saved-reports">
                {relatoriosSalvos.map((relatorio) => (
                  <div className="saved-report" key={relatorio.id}>
                    <div className="saved-report-meta">
                      <div className="saved-report-name">{relatorio.nome}</div>
                      <div className="saved-report-date">Gerado em {relatorio.dataGeracao}</div>
                    </div>

                    <div className="saved-report-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => baixarRelatorioSalvo(relatorio.id, relatorio.nome)}
                      >
                        Baixar PDF
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => excluirRelatorioSalvo(relatorio.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

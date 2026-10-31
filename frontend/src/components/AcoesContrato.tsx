import { Alert, Box, Button, InputAdornment, TextField, Typography, type SxProps, type Theme } from '@mui/material'
import { useState, type SubmitEvent } from 'react'
import { TEXTOS } from '../constants/textos.ts'
import { REGRAS_VALIDACAO } from '../constants/validacao.ts'
import { useAutenticacao } from '../hooks/useAutenticacao.ts'
import { extrairMensagemDeErro } from '../services/api.ts'
import { concederCredito, executarContrato } from '../services/pedidoService.ts'
import type { Pedido } from '../types/pedido.ts'
import { formatarNumeroPedido } from '../utils/formatacao.ts'
import { obterBloqueioExecucao, podeConcederCredito } from '../utils/regrasPedido.ts'
import { DialogoConfirmacao } from './DialogoConfirmacao.tsx'

interface PropriedadesAcoesContrato {
  pedido: Pedido
  aoAtualizar: () => void
}

export function AcoesContrato({ pedido, aoAtualizar }: PropriedadesAcoesContrato) {
  const { sessao } = useAutenticacao()
  const [valor, setValor] = useState('')
  const [prazoMeses, setPrazoMeses] = useState('')
  const [concedendo, setConcedendo] = useState(false)
  const [confirmandoExecucao, setConfirmandoExecucao] = useState(false)
  const [executando, setExecutando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [erroExecucao, setErroExecucao] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)
  const bloqueioExecucao = obterBloqueioExecucao(pedido)

  async function enviarCredito(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault()
    setErro(null)
    setSucesso(null)
    setConcedendo(true)
    try {
      await concederCredito(pedido.id, { valor: Number(valor), prazoMeses: Number(prazoMeses) })
      setSucesso(TEXTOS.acoesContrato.creditoConcedido)
      aoAtualizar()
    } catch (falha) {
      setErro(extrairMensagemDeErro(falha))
    } finally {
      setConcedendo(false)
    }
  }

  async function confirmarExecucao() {
    setErroExecucao(null)
    setExecutando(true)
    try {
      await executarContrato(pedido.id)
      setConfirmandoExecucao(false)
      setSucesso(TEXTOS.acoesContrato.contratoExecutado)
      aoAtualizar()
    } catch (falha) {
      setErroExecucao(extrairMensagemDeErro(falha))
    } finally {
      setExecutando(false)
    }
  }

  return (
    <Box sx={estilos.container}>
      {sucesso && <Alert severity="success">{sucesso}</Alert>}
      {erro && <Alert severity="error">{erro}</Alert>}
      {podeConcederCredito(pedido, sessao) && (
        <Box component="form" onSubmit={enviarCredito} sx={estilos.secao}>
          <Typography variant="subtitle2" color="text.secondary">
            {TEXTOS.acoesContrato.secaoCredito}
          </Typography>
          <Box sx={estilos.linhaDupla}>
            <TextField
              label={TEXTOS.acoesContrato.campoValor}
              type="number"
              value={valor}
              onChange={(evento) => setValor(evento.target.value)}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">{TEXTOS.geral.simboloMoeda}</InputAdornment>,
                },
                htmlInput: {
                  min: REGRAS_VALIDACAO.valorMinimoCredito,
                  step: REGRAS_VALIDACAO.passoValorMonetario,
                },
              }}
              required
            />
            <TextField
              label={TEXTOS.acoesContrato.campoPrazo}
              type="number"
              value={prazoMeses}
              onChange={(evento) => setPrazoMeses(evento.target.value)}
              slotProps={{ htmlInput: { min: REGRAS_VALIDACAO.prazoMinimoCreditoMeses } }}
              required
            />
          </Box>
          <Button type="submit" variant="contained" color="secondary" size="large" disabled={concedendo} fullWidth>
            {concedendo ? TEXTOS.acoesContrato.concedendo : TEXTOS.acoesContrato.botaoConceder}
          </Button>
        </Box>
      )}
      <Box sx={estilos.secao}>
        <Typography variant="subtitle2" color="text.secondary">
          {TEXTOS.acoesContrato.secaoContrato}
        </Typography>
        {bloqueioExecucao && (
          <Typography variant="body2" color="text.secondary">
            {bloqueioExecucao}
          </Typography>
        )}
        <Button
          variant="contained"
          color="success"
          size="large"
          disabled={bloqueioExecucao !== null}
          onClick={() => setConfirmandoExecucao(true)}
          fullWidth
        >
          {TEXTOS.acoesContrato.botaoExecutar}
        </Button>
      </Box>
      <DialogoConfirmacao
        aberto={confirmandoExecucao}
        titulo={TEXTOS.acoesContrato.tituloConfirmarExecucao}
        texto={TEXTOS.acoesContrato.textoConfirmarExecucao(formatarNumeroPedido(pedido.id))}
        rotuloCancelar={TEXTOS.acoesContrato.botaoVoltar}
        rotuloConfirmar={executando ? TEXTOS.acoesContrato.executando : TEXTOS.acoesContrato.botaoExecutar}
        corConfirmar="primary"
        processando={executando}
        erro={erroExecucao}
        aoCancelar={() => setConfirmandoExecucao(false)}
        aoConfirmar={confirmarExecucao}
      />
    </Box>
  )
}

const estilos = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  secao: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  },
  linhaDupla: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 2,
  },
} satisfies Record<string, SxProps<Theme>>

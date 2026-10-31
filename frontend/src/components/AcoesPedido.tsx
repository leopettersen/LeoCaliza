import { Button } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TEXTOS } from '../constants/textos.ts'
import { obterCaminhoEditarPedido } from '../routes/caminhos.ts'
import { extrairMensagemDeErro } from '../services/api.ts'
import { cancelarPedido } from '../services/pedidoService.ts'
import type { Pedido } from '../types/pedido.ts'
import { formatarNumeroPedido } from '../utils/formatacao.ts'
import { podeCancelar, podeModificar } from '../utils/regrasPedido.ts'
import { DialogoConfirmacao } from './DialogoConfirmacao.tsx'

interface PropriedadesAcoesPedido {
  pedido: Pedido
  aoCancelar: () => void
  destaque?: boolean
}

export function AcoesPedido({ pedido, aoCancelar, destaque = false }: PropriedadesAcoesPedido) {
  const navegar = useNavigate()
  const [confirmando, setConfirmando] = useState(false)
  const [cancelando, setCancelando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const tamanho = destaque ? 'large' : 'small'

  function abrirConfirmacao() {
    setErro(null)
    setConfirmando(true)
  }

  async function confirmarCancelamento() {
    setCancelando(true)
    setErro(null)
    try {
      await cancelarPedido(pedido.id)
      setConfirmando(false)
      aoCancelar()
    } catch (falha) {
      setErro(extrairMensagemDeErro(falha))
    } finally {
      setCancelando(false)
    }
  }

  return (
    <>
      <Button
        size={tamanho}
        variant={destaque ? 'contained' : 'outlined'}
        disabled={!podeModificar(pedido)}
        onClick={() => navegar(obterCaminhoEditarPedido(pedido.id))}
      >
        {TEXTOS.acoesPedido.botaoModificar}
      </Button>
      <Button size={tamanho} variant="outlined" color="error" disabled={!podeCancelar(pedido)} onClick={abrirConfirmacao}>
        {destaque ? TEXTOS.acoesPedido.botaoCancelarPedido : TEXTOS.acoesPedido.botaoCancelar}
      </Button>
      <DialogoConfirmacao
        aberto={confirmando}
        titulo={TEXTOS.acoesPedido.tituloConfirmar}
        texto={TEXTOS.acoesPedido.textoConfirmar(formatarNumeroPedido(pedido.id))}
        rotuloCancelar={TEXTOS.acoesPedido.botaoVoltar}
        rotuloConfirmar={cancelando ? TEXTOS.acoesPedido.cancelando : TEXTOS.acoesPedido.botaoCancelarPedido}
        processando={cancelando}
        erro={erro}
        aoCancelar={() => setConfirmando(false)}
        aoConfirmar={confirmarCancelamento}
      />
    </>
  )
}

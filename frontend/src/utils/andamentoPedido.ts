import { ESTADOS_ETAPA, STATUS_PEDIDO } from '../constants/status.ts'
import { TEXTOS } from '../constants/textos.ts'
import type { Pedido } from '../types/pedido.ts'

export type EstadoEtapa = (typeof ESTADOS_ETAPA)[keyof typeof ESTADOS_ETAPA]

export interface EtapaAndamento {
  rotulo: string
  estado: EstadoEtapa
}

export function montarAndamento(pedido: Pedido): EtapaAndamento[] {
  const cancelado = pedido.status === STATUS_PEDIDO.cancelado
  const etapas: EtapaAndamento[] = [{ rotulo: TEXTOS.andamento.pedidoEnviado, estado: ESTADOS_ETAPA.concluida }]

  etapas.push({
    rotulo: TEXTOS.andamento.emAnalise,
    estado: pedido.status === STATUS_PEDIDO.emAnalise ? ESTADOS_ETAPA.atual : ESTADOS_ETAPA.concluida,
  })

  if (pedido.avaliacao && !pedido.avaliacao.resultado) {
    etapas.push({ rotulo: TEXTOS.andamento.parecerNegativo, estado: ESTADOS_ETAPA.erro })
    return etapas
  }

  if (pedido.avaliacao) {
    etapas.push({ rotulo: TEXTOS.andamento.parecerPositivo, estado: ESTADOS_ETAPA.concluida })
  } else if (!cancelado) {
    etapas.push({ rotulo: TEXTOS.andamento.parecerPendente, estado: ESTADOS_ETAPA.pendente })
  }

  if (pedido.status === STATUS_PEDIDO.contratoExecutado) {
    etapas.push({ rotulo: TEXTOS.andamento.contratoExecutado, estado: ESTADOS_ETAPA.concluida })
  } else if (!cancelado) {
    etapas.push({
      rotulo: TEXTOS.andamento.contratoExecutado,
      estado: pedido.status === STATUS_PEDIDO.aprovado ? ESTADOS_ETAPA.atual : ESTADOS_ETAPA.pendente,
    })
  }

  if (cancelado) {
    etapas.push({ rotulo: TEXTOS.andamento.cancelado, estado: ESTADOS_ETAPA.erro })
  }
  return etapas
}

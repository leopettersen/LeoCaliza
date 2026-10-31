import type { StatusPedido } from '../types/pedido.ts'

export const STATUS_PEDIDO = {
  emAnalise: 'EM_ANALISE',
  aprovado: 'APROVADO',
  reprovado: 'REPROVADO',
  contratoExecutado: 'CONTRATO_EXECUTADO',
  cancelado: 'CANCELADO',
} as const

export const ROTULOS_STATUS: Record<StatusPedido, string> = {
  [STATUS_PEDIDO.emAnalise]: 'Em análise',
  [STATUS_PEDIDO.aprovado]: 'Aprovado',
  [STATUS_PEDIDO.reprovado]: 'Reprovado',
  [STATUS_PEDIDO.contratoExecutado]: 'Contrato executado',
  [STATUS_PEDIDO.cancelado]: 'Cancelado',
}

export const ESTADOS_ETAPA = {
  concluida: 'concluida',
  atual: 'atual',
  pendente: 'pendente',
  erro: 'erro',
} as const

export const CORES_STATUS: Record<StatusPedido, 'info' | 'success' | 'error' | 'primary' | 'default'> = {
  [STATUS_PEDIDO.emAnalise]: 'info',
  [STATUS_PEDIDO.aprovado]: 'success',
  [STATUS_PEDIDO.reprovado]: 'error',
  [STATUS_PEDIDO.contratoExecutado]: 'primary',
  [STATUS_PEDIDO.cancelado]: 'default',
}

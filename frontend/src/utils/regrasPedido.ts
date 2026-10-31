import { STATUS_PEDIDO } from '../constants/status.ts'
import type { Pedido } from '../types/pedido.ts'

export function podeModificar(pedido: Pedido) {
  return pedido.status === STATUS_PEDIDO.emAnalise
}

export function podeCancelar(pedido: Pedido) {
  return pedido.status !== STATUS_PEDIDO.contratoExecutado && pedido.status !== STATUS_PEDIDO.cancelado
}

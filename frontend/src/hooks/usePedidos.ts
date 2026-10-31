import { useCallback } from 'react'
import { listarPedidos } from '../services/pedidoService.ts'
import type { StatusPedido } from '../types/pedido.ts'
import { useRequisicao } from './useRequisicao.ts'

export function usePedidos(status?: StatusPedido) {
  const buscar = useCallback(() => listarPedidos(status), [status])
  const { dados, carregando, erro, recarregar } = useRequisicao(buscar)
  return { pedidos: dados ?? [], carregando, erro, recarregar }
}

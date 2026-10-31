import { useCallback } from 'react'
import { buscarPedido } from '../services/pedidoService.ts'
import { useRequisicao } from './useRequisicao.ts'

export function usePedido(id: number) {
  const buscar = useCallback(() => buscarPedido(id), [id])
  const { dados, carregando, erro, recarregar } = useRequisicao(buscar)
  return { pedido: dados, carregando, erro, recarregar }
}

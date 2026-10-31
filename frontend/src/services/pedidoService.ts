import { ENDPOINTS, PARAMETROS_API } from '../constants/api.ts'
import type { DadosPedido, Pedido, StatusPedido } from '../types/pedido.ts'
import { api } from './api.ts'

export async function listarPedidos(status?: StatusPedido) {
  const { data } = await api.get<Pedido[]>(ENDPOINTS.pedidos.base, {
    params: status ? { [PARAMETROS_API.status]: status } : undefined,
  })
  return data
}

export async function criarPedido(dados: DadosPedido) {
  const { data } = await api.post<Pedido>(ENDPOINTS.pedidos.base, dados)
  return data
}

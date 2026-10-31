import { ENDPOINTS, PARAMETROS_API } from '../constants/api.ts'
import type { DadosAvaliacao, DadosPedido, Pedido, StatusPedido } from '../types/pedido.ts'
import { api } from './api.ts'

export async function listarPedidos(status?: StatusPedido) {
  const { data } = await api.get<Pedido[]>(ENDPOINTS.pedidos.base, {
    params: status ? { [PARAMETROS_API.status]: status } : undefined,
  })
  return data
}

export async function buscarPedido(id: number) {
  const { data } = await api.get<Pedido>(ENDPOINTS.pedidos.porId(id))
  return data
}

export async function criarPedido(dados: DadosPedido) {
  const { data } = await api.post<Pedido>(ENDPOINTS.pedidos.base, dados)
  return data
}

export async function modificarPedido(id: number, dados: DadosPedido) {
  const { data } = await api.put<Pedido>(ENDPOINTS.pedidos.porId(id), dados)
  return data
}

export async function avaliarPedido(id: number, dados: DadosAvaliacao) {
  const { data } = await api.post<Pedido>(ENDPOINTS.pedidos.avaliacao(id), dados)
  return data
}

export async function cancelarPedido(id: number) {
  await api.delete(ENDPOINTS.pedidos.porId(id))
}

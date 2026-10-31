import { generatePath } from 'react-router-dom'
import { PERFIS } from '../constants/perfis.ts'
import { ROTAS } from '../constants/rotas.ts'
import type { Perfil } from '../types/auth.ts'

export function obterCaminhoDetalhePedido(id: number) {
  return generatePath(ROTAS.cliente.detalhePedido, { id: String(id) })
}

export function obterCaminhoEditarPedido(id: number, perfil: Perfil = PERFIS.cliente) {
  const rota = perfil === PERFIS.agente ? ROTAS.agente.editarPedido : ROTAS.cliente.editarPedido
  return generatePath(rota, { id: String(id) })
}

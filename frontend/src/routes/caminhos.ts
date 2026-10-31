import { generatePath } from 'react-router-dom'
import { ROTAS } from '../constants/rotas.ts'

export function obterCaminhoDetalhePedido(id: number) {
  return generatePath(ROTAS.cliente.detalhePedido, { id: String(id) })
}

import { PERFIS } from '../constants/perfis.ts'
import { ROTAS } from '../constants/rotas.ts'
import type { Perfil } from '../types/auth.ts'

export function obterRotaInicial(perfil: Perfil) {
  return perfil === PERFIS.agente ? ROTAS.agente.pedidos : ROTAS.cliente.pedidos
}

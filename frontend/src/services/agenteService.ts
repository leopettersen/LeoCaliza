import { ENDPOINTS } from '../constants/api.ts'
import type { Agente } from '../types/agente.ts'
import { api } from './api.ts'

export async function listarAgentes() {
  const { data } = await api.get<Agente[]>(ENDPOINTS.agentes.base)
  return data
}

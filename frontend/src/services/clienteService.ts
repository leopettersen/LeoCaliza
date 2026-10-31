import { ENDPOINTS } from '../constants/api.ts'
import type { Cliente } from '../types/cliente.ts'
import { api } from './api.ts'

export async function consultarMeuCadastro() {
  const { data } = await api.get<Cliente>(ENDPOINTS.clientes.meuCadastro)
  return data
}

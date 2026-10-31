import { ENDPOINTS } from '../constants/api.ts'
import type { Cliente, DadosCliente } from '../types/cliente.ts'
import { api } from './api.ts'

export async function consultarMeuCadastro() {
  const { data } = await api.get<Cliente>(ENDPOINTS.clientes.meuCadastro)
  return data
}

export async function atualizarMeuCadastro(dados: DadosCliente) {
  const { data } = await api.put<Cliente>(ENDPOINTS.clientes.meuCadastro, dados)
  return data
}

export async function excluirMinhaConta() {
  await api.delete(ENDPOINTS.clientes.meuCadastro)
}

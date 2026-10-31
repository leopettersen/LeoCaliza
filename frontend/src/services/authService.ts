import { ENDPOINTS } from '../constants/api.ts'
import type { CredenciaisLogin, DadosCadastro, RespostaCadastro, RespostaLogin } from '../types/auth.ts'
import { api } from './api.ts'

export async function fazerLogin(credenciais: CredenciaisLogin) {
  const { data } = await api.post<RespostaLogin>(ENDPOINTS.auth.login, credenciais)
  return data
}

export async function cadastrarUsuario(dados: DadosCadastro) {
  const { data } = await api.post<RespostaCadastro>(ENDPOINTS.auth.cadastro, dados)
  return data
}

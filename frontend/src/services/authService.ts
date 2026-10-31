import { ENDPOINTS } from '../constants/api.ts'
import type { CredenciaisLogin, RespostaLogin } from '../types/auth.ts'
import { api } from './api.ts'

export async function fazerLogin(credenciais: CredenciaisLogin) {
  const { data } = await api.post<RespostaLogin>(ENDPOINTS.auth.login, credenciais)
  return data
}

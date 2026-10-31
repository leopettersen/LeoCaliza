import axios from 'axios'
import { API_URL, TEMPO_LIMITE_MS } from '../constants/api.ts'
import { TEXTOS } from '../constants/textos.ts'

export const api = axios.create({
  baseURL: API_URL,
  timeout: TEMPO_LIMITE_MS,
})

export function extrairMensagemDeErro(erro: unknown) {
  if (axios.isAxiosError<{ erro?: string }>(erro)) {
    if (!erro.response) {
      return TEXTOS.erros.semConexao
    }
    return erro.response.data?.erro ?? TEXTOS.erros.generico
  }
  return TEXTOS.erros.generico
}

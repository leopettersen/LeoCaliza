import axios from 'axios'
import { API_URL, CABECALHOS_HTTP, ENDPOINTS, STATUS_HTTP, TEMPO_LIMITE_MS, TIPO_TOKEN } from '../constants/api.ts'
import { TEXTOS } from '../constants/textos.ts'
import { lerSessaoSalva } from './armazenamentoSessao.ts'

export const api = axios.create({
  baseURL: API_URL,
  timeout: TEMPO_LIMITE_MS,
})

let ouvinteSessaoExpirada: (() => void) | null = null

export function aoExpirarSessao(ouvinte: () => void) {
  ouvinteSessaoExpirada = ouvinte
  return () => {
    if (ouvinteSessaoExpirada === ouvinte) {
      ouvinteSessaoExpirada = null
    }
  }
}

api.interceptors.request.use((configuracao) => {
  const sessao = lerSessaoSalva()
  if (sessao) {
    configuracao.headers.set(CABECALHOS_HTTP.autorizacao, `${TIPO_TOKEN} ${sessao.token}`)
  }
  return configuracao
})

api.interceptors.response.use(undefined, (erro: unknown) => {
  if (
    axios.isAxiosError(erro) &&
    erro.response?.status === STATUS_HTTP.naoAutorizado &&
    erro.config?.url !== ENDPOINTS.auth.login
  ) {
    ouvinteSessaoExpirada?.()
  }
  return Promise.reject(erro)
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

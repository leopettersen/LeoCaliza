const URL_PADRAO_DA_API = 'http://localhost:8080'

export const API_URL = import.meta.env.VITE_API_URL || URL_PADRAO_DA_API

export const TEMPO_LIMITE_MS = 15000

export const CABECALHOS_HTTP = {
  autorizacao: 'Authorization',
} as const

export const TIPO_TOKEN = 'Bearer'

export const STATUS_HTTP = {
  naoAutorizado: 401,
} as const

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    cadastro: '/auth/register',
  },
} as const

import type { PERFIS, TIPOS_AGENTE } from '../constants/perfis.ts'

export type Perfil = (typeof PERFIS)[keyof typeof PERFIS]

export type TipoAgente = (typeof TIPOS_AGENTE)[keyof typeof TIPOS_AGENTE]

export interface CredenciaisLogin {
  login: string
  senha: string
}

export interface RespostaLogin {
  token: string
  tipo: string
  perfil: Perfil
  nome: string
  tipoAgente: TipoAgente | null
}

export interface DadosCadastro {
  login: string
  senha: string
  perfil: Perfil
  nome: string
  rg?: string
  cpf?: string
  endereco?: string
  profissao?: string
  tipoAgente?: TipoAgente
}

export interface RespostaCadastro {
  id: number
  login: string
  perfil: Perfil
}

export interface Sessao {
  token: string
  perfil: Perfil
  nome: string
  tipoAgente: TipoAgente | null
}

import { createContext } from 'react'
import type { CredenciaisLogin, Sessao } from '../types/auth.ts'

export interface ValorContextoAutenticacao {
  sessao: Sessao | null
  estaAutenticado: boolean
  entrar: (credenciais: CredenciaisLogin) => Promise<Sessao>
  sair: () => void
}

export const ContextoAutenticacao = createContext<ValorContextoAutenticacao | null>(null)

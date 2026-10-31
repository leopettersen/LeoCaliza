import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { CHAVES_ARMAZENAMENTO } from '../constants/armazenamento.ts'
import { fazerLogin } from '../services/authService.ts'
import type { CredenciaisLogin, Sessao } from '../types/auth.ts'
import { ContextoAutenticacao } from './ContextoAutenticacao.ts'

function lerSessaoSalva(): Sessao | null {
  try {
    const salva = localStorage.getItem(CHAVES_ARMAZENAMENTO.sessao)
    return salva ? (JSON.parse(salva) as Sessao) : null
  } catch {
    return null
  }
}

function salvarSessao(sessao: Sessao) {
  try {
    localStorage.setItem(CHAVES_ARMAZENAMENTO.sessao, JSON.stringify(sessao))
  } catch {
    return
  }
}

function apagarSessao() {
  try {
    localStorage.removeItem(CHAVES_ARMAZENAMENTO.sessao)
  } catch {
    return
  }
}

export function ProvedorAutenticacao({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(lerSessaoSalva)

  const entrar = useCallback(async (credenciais: CredenciaisLogin) => {
    const resposta = await fazerLogin(credenciais)
    const novaSessao: Sessao = {
      token: resposta.token,
      perfil: resposta.perfil,
      nome: resposta.nome,
      tipoAgente: resposta.tipoAgente,
    }
    salvarSessao(novaSessao)
    setSessao(novaSessao)
    return novaSessao
  }, [])

  const sair = useCallback(() => {
    apagarSessao()
    setSessao(null)
  }, [])

  const valor = useMemo(
    () => ({ sessao, estaAutenticado: sessao !== null, entrar, sair }),
    [sessao, entrar, sair],
  )

  return <ContextoAutenticacao.Provider value={valor}>{children}</ContextoAutenticacao.Provider>
}

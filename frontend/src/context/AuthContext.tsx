import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { TEXTOS } from '../constants/textos.ts'
import { aoExpirarSessao } from '../services/api.ts'
import { apagarSessao, lerSessaoSalva, salvarSessao } from '../services/armazenamentoSessao.ts'
import { fazerLogin } from '../services/authService.ts'
import type { CredenciaisLogin, Sessao } from '../types/auth.ts'
import { ContextoAutenticacao } from './ContextoAutenticacao.ts'

export function ProvedorAutenticacao({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(lerSessaoSalva)
  const [avisoSaida, setAvisoSaida] = useState<string | null>(null)

  const entrar = useCallback(async (credenciais: CredenciaisLogin) => {
    const resposta = await fazerLogin(credenciais)
    const novaSessao: Sessao = {
      token: resposta.token,
      id: resposta.id,
      perfil: resposta.perfil,
      nome: resposta.nome,
      tipoAgente: resposta.tipoAgente,
    }
    salvarSessao(novaSessao)
    setSessao(novaSessao)
    setAvisoSaida(null)
    return novaSessao
  }, [])

  const sair = useCallback((aviso?: string) => {
    apagarSessao()
    setSessao(null)
    setAvisoSaida(aviso ?? null)
  }, [])

  useEffect(() => aoExpirarSessao(() => sair(TEXTOS.login.sessaoExpirada)), [sair])

  const valor = useMemo(
    () => ({ sessao, estaAutenticado: sessao !== null, avisoSaida, entrar, sair }),
    [sessao, avisoSaida, entrar, sair],
  )

  return <ContextoAutenticacao.Provider value={valor}>{children}</ContextoAutenticacao.Provider>
}

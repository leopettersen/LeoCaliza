import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { aoExpirarSessao } from '../services/api.ts'
import { apagarSessao, lerSessaoSalva, salvarSessao } from '../services/armazenamentoSessao.ts'
import { fazerLogin } from '../services/authService.ts'
import type { CredenciaisLogin, Sessao } from '../types/auth.ts'
import { ContextoAutenticacao } from './ContextoAutenticacao.ts'

export function ProvedorAutenticacao({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(lerSessaoSalva)
  const [sessaoExpirada, setSessaoExpirada] = useState(false)

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
    setSessaoExpirada(false)
    return novaSessao
  }, [])

  const sair = useCallback(() => {
    apagarSessao()
    setSessao(null)
  }, [])

  useEffect(
    () =>
      aoExpirarSessao(() => {
        apagarSessao()
        setSessao(null)
        setSessaoExpirada(true)
      }),
    [],
  )

  const valor = useMemo(
    () => ({ sessao, estaAutenticado: sessao !== null, sessaoExpirada, entrar, sair }),
    [sessao, sessaoExpirada, entrar, sair],
  )

  return <ContextoAutenticacao.Provider value={valor}>{children}</ContextoAutenticacao.Provider>
}

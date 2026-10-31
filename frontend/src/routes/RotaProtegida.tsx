import { Navigate, Outlet } from 'react-router-dom'
import { ROTAS } from '../constants/rotas.ts'
import { useAutenticacao } from '../hooks/useAutenticacao.ts'
import type { Perfil } from '../types/auth.ts'
import { obterRotaInicial } from './rotaInicial.ts'

export function RotaProtegida({ perfisPermitidos }: { perfisPermitidos: Perfil[] }) {
  const { sessao } = useAutenticacao()

  if (!sessao) {
    return <Navigate to={ROTAS.login} replace />
  }
  if (!perfisPermitidos.includes(sessao.perfil)) {
    return <Navigate to={obterRotaInicial(sessao.perfil)} replace />
  }
  return <Outlet />
}

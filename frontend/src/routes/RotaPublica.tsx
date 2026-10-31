import { Navigate, Outlet } from 'react-router-dom'
import { useAutenticacao } from '../hooks/useAutenticacao.ts'
import { obterRotaInicial } from './rotaInicial.ts'

export function RotaPublica() {
  const { sessao } = useAutenticacao()

  if (sessao) {
    return <Navigate to={obterRotaInicial(sessao.perfil)} replace />
  }
  return <Outlet />
}

import { Navigate, Route, Routes } from 'react-router-dom'
import { ROTAS } from '../constants/rotas.ts'
import { PaginaCadastro } from '../pages/auth/PaginaCadastro.tsx'
import { PaginaLogin } from '../pages/auth/PaginaLogin.tsx'

export function RotasDaAplicacao() {
  return (
    <Routes>
      <Route path={ROTAS.login} element={<PaginaLogin />} />
      <Route path={ROTAS.cadastro} element={<PaginaCadastro />} />
      <Route path={ROTAS.qualquerOutra} element={<Navigate to={ROTAS.login} replace />} />
    </Routes>
  )
}

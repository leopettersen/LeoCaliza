import { Navigate, Route, Routes } from 'react-router-dom'
import { ROTAS } from '../constants/rotas.ts'
import { PaginaLogin } from '../pages/auth/PaginaLogin.tsx'

export function RotasDaAplicacao() {
  return (
    <Routes>
      <Route path={ROTAS.login} element={<PaginaLogin />} />
      <Route path={ROTAS.qualquerOutra} element={<Navigate to={ROTAS.login} replace />} />
    </Routes>
  )
}

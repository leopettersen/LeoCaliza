import { Navigate, Route, Routes } from 'react-router-dom'
import { PERFIS } from '../constants/perfis.ts'
import { ROTAS } from '../constants/rotas.ts'
import { PaginaPedidosRecebidos } from '../pages/agente/PaginaPedidosRecebidos.tsx'
import { PaginaCadastro } from '../pages/auth/PaginaCadastro.tsx'
import { PaginaLogin } from '../pages/auth/PaginaLogin.tsx'
import { PaginaDetalhePedido } from '../pages/cliente/PaginaDetalhePedido.tsx'
import { PaginaMeuCadastro } from '../pages/cliente/PaginaMeuCadastro.tsx'
import { PaginaMeusPedidos } from '../pages/cliente/PaginaMeusPedidos.tsx'
import { PaginaNovoPedido } from '../pages/cliente/PaginaNovoPedido.tsx'
import { RotaProtegida } from './RotaProtegida.tsx'
import { RotaPublica } from './RotaPublica.tsx'

export function RotasDaAplicacao() {
  return (
    <Routes>
      <Route element={<RotaPublica />}>
        <Route path={ROTAS.login} element={<PaginaLogin />} />
        <Route path={ROTAS.cadastro} element={<PaginaCadastro />} />
      </Route>
      <Route element={<RotaProtegida perfisPermitidos={[PERFIS.cliente]} />}>
        <Route path={ROTAS.cliente.pedidos} element={<PaginaMeusPedidos />} />
        <Route path={ROTAS.cliente.novoPedido} element={<PaginaNovoPedido />} />
        <Route path={ROTAS.cliente.detalhePedido} element={<PaginaDetalhePedido />} />
        <Route path={ROTAS.cliente.meuCadastro} element={<PaginaMeuCadastro />} />
      </Route>
      <Route element={<RotaProtegida perfisPermitidos={[PERFIS.agente]} />}>
        <Route path={ROTAS.agente.pedidos} element={<PaginaPedidosRecebidos />} />
      </Route>
      <Route path={ROTAS.qualquerOutra} element={<Navigate to={ROTAS.login} replace />} />
    </Routes>
  )
}

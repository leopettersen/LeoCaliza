import type { Perfil } from '../types/auth.ts'
import { PERFIS } from './perfis.ts'
import { ROTAS } from './rotas.ts'
import { TEXTOS } from './textos.ts'

export interface ItemMenu {
  rotulo: string
  rota: string
}

export const MENUS: Record<Perfil, ItemMenu[]> = {
  [PERFIS.cliente]: [
    { rotulo: TEXTOS.menu.meusPedidos, rota: ROTAS.cliente.pedidos },
    { rotulo: TEXTOS.menu.novoPedido, rota: ROTAS.cliente.novoPedido },
    { rotulo: TEXTOS.menu.meuCadastro, rota: ROTAS.cliente.meuCadastro },
  ],
  [PERFIS.agente]: [{ rotulo: TEXTOS.menu.pedidosRecebidos, rota: ROTAS.agente.pedidos }],
}

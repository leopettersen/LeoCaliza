export const ROTAS = {
  login: '/login',
  cadastro: '/cadastro',
  qualquerOutra: '*',
  cliente: {
    pedidos: '/cliente/pedidos',
    novoPedido: '/cliente/pedidos/novo',
    detalhePedido: '/cliente/pedidos/:id',
    meuCadastro: '/cliente/meu-cadastro',
  },
  agente: {
    pedidos: '/agente/pedidos',
  },
} as const

export const PARAMETROS_URL = {
  perfil: 'perfil',
} as const

import type { STATUS_PEDIDO } from '../constants/status.ts'
import type { TIPOS_PROPRIETARIO } from '../constants/perfis.ts'
import type { Cliente } from './cliente.ts'

export type StatusPedido = (typeof STATUS_PEDIDO)[keyof typeof STATUS_PEDIDO]

export type TipoProprietario = (typeof TIPOS_PROPRIETARIO)[keyof typeof TIPOS_PROPRIETARIO]

export interface Automovel {
  id: number
  matricula: string
  ano: number
  marca: string
  modelo: string
  placa: string
  proprietarioId: number
  proprietarioNome: string
  tipoProprietario: TipoProprietario
}

export interface AvaliacaoFinanceira {
  id: number
  resultado: boolean
  observacao: string
  data: string
  agenteId: number
  agenteNome: string
}

export interface ContratoCredito {
  id: number
  valor: number
  prazoMeses: number
  agenteId: number
  agenteNome: string
}

export interface ContratoAluguel {
  id: number
  dataExecucao: string
}

export interface Pedido {
  id: number
  cliente: Cliente
  rendaTotal: number
  automovel: Automovel
  bancoCreditoId: number | null
  bancoCreditoNome: string | null
  dataCriacao: string
  dataRetirada: string
  dataDevolucao: string
  status: StatusPedido
  avaliacao: AvaliacaoFinanceira | null
  contratoCredito: ContratoCredito | null
  contratoAluguel: ContratoAluguel | null
  modificadoPor: string | null
  dataModificacao: string | null
}

export interface DadosAutomovel {
  matricula: string
  ano: number
  marca: string
  modelo: string
  placa: string
}

export interface DadosPedido {
  automovel: DadosAutomovel
  tipoProprietario: TipoProprietario
  proprietarioId: number | null
  bancoCreditoId: number | null
  dataRetirada: string
  dataDevolucao: string
}

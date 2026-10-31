import { TIPOS_PROPRIETARIO } from '../constants/perfis.ts'
import type { DadosPedido, Pedido, TipoProprietario } from '../types/pedido.ts'

export const SEM_SELECAO = ''

export interface ValoresFormularioPedido {
  marca: string
  modelo: string
  ano: string
  placa: string
  matricula: string
  dataRetirada: string
  dataDevolucao: string
  tipoProprietario: TipoProprietario
  proprietarioId: string
  associarCredito: boolean
  bancoCreditoId: string
}

export const VALORES_INICIAIS_PEDIDO: ValoresFormularioPedido = {
  marca: '',
  modelo: '',
  ano: '',
  placa: '',
  matricula: '',
  dataRetirada: '',
  dataDevolucao: '',
  tipoProprietario: TIPOS_PROPRIETARIO.cliente,
  proprietarioId: SEM_SELECAO,
  associarCredito: false,
  bancoCreditoId: SEM_SELECAO,
}

export function paraValoresFormulario(pedido: Pedido): ValoresFormularioPedido {
  const { automovel } = pedido
  const proprietarioEhCliente = automovel.tipoProprietario === TIPOS_PROPRIETARIO.cliente
  return {
    marca: automovel.marca,
    modelo: automovel.modelo,
    ano: String(automovel.ano),
    placa: automovel.placa,
    matricula: automovel.matricula,
    dataRetirada: pedido.dataRetirada,
    dataDevolucao: pedido.dataDevolucao,
    tipoProprietario: automovel.tipoProprietario,
    proprietarioId: proprietarioEhCliente ? SEM_SELECAO : String(automovel.proprietarioId),
    associarCredito: pedido.bancoCreditoId !== null,
    bancoCreditoId: pedido.bancoCreditoId === null ? SEM_SELECAO : String(pedido.bancoCreditoId),
  }
}

export function paraDadosPedido(valores: ValoresFormularioPedido): DadosPedido {
  const proprietarioEhCliente = valores.tipoProprietario === TIPOS_PROPRIETARIO.cliente
  return {
    automovel: {
      marca: valores.marca.trim(),
      modelo: valores.modelo.trim(),
      ano: Number(valores.ano),
      placa: valores.placa.trim(),
      matricula: valores.matricula.trim(),
    },
    tipoProprietario: valores.tipoProprietario,
    proprietarioId: proprietarioEhCliente ? null : Number(valores.proprietarioId),
    bancoCreditoId: valores.associarCredito ? Number(valores.bancoCreditoId) : null,
    dataRetirada: valores.dataRetirada,
    dataDevolucao: valores.dataDevolucao,
  }
}

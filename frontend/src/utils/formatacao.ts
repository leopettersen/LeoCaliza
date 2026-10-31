import { FORMATOS } from '../constants/formatos.ts'
import type { Automovel } from '../types/pedido.ts'

const formatadorMoeda = new Intl.NumberFormat(FORMATOS.localidade, {
  style: 'currency',
  currency: FORMATOS.moeda,
})

const formatadorDataHora = new Intl.DateTimeFormat(FORMATOS.localidade, {
  dateStyle: 'short',
  timeStyle: 'short',
})

export function formatarNumeroPedido(id: number) {
  return `${FORMATOS.prefixoNumeroPedido}${String(id).padStart(FORMATOS.digitosNumeroPedido, '0')}`
}

export function formatarData(dataIso: string) {
  const [ano, mes, dia] = dataIso.split(FORMATOS.separadorDataIso)
  return [dia, mes, ano].join(FORMATOS.separadorDataExibicao)
}

export function formatarDataHora(dataHoraIso: string) {
  return formatadorDataHora.format(new Date(dataHoraIso))
}

export function formatarPeriodo(inicio: string, fim: string) {
  return [formatarData(inicio), formatarData(fim)].join(FORMATOS.separadorPeriodo)
}

export function formatarMoeda(valor: number) {
  return formatadorMoeda.format(valor)
}

export function descreverModelo(automovel: Automovel) {
  return [automovel.marca, automovel.modelo].join(FORMATOS.separadorPalavras)
}

export function descreverAutomovel(automovel: Automovel) {
  return [descreverModelo(automovel), automovel.placa].join(FORMATOS.separadorAutomovel)
}

import { FORMATOS } from '../constants/formatos.ts'

export function obterDataDeHojeIso() {
  const hoje = new Date()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return [hoje.getFullYear(), mes, dia].join(FORMATOS.separadorDataIso)
}

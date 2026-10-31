import { MenuItem, TextField } from '@mui/material'
import { ROTULOS_STATUS, STATUS_PEDIDO } from '../constants/status.ts'
import { TEXTOS } from '../constants/textos.ts'
import type { StatusPedido } from '../types/pedido.ts'

export const TODOS_OS_STATUS = ''

export type OpcaoFiltroStatus = StatusPedido | typeof TODOS_OS_STATUS

interface PropriedadesFiltroStatus {
  valor: OpcaoFiltroStatus
  aoAlterar: (valor: OpcaoFiltroStatus) => void
}

export function FiltroStatus({ valor, aoAlterar }: PropriedadesFiltroStatus) {
  return (
    <TextField
      select
      label={TEXTOS.filtroStatus.rotulo}
      value={valor}
      onChange={(evento) => aoAlterar(evento.target.value as OpcaoFiltroStatus)}
      slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
    >
      <MenuItem value={TODOS_OS_STATUS}>{TEXTOS.filtroStatus.todos}</MenuItem>
      {Object.values(STATUS_PEDIDO).map((opcao) => (
        <MenuItem key={opcao} value={opcao}>
          {ROTULOS_STATUS[opcao]}
        </MenuItem>
      ))}
    </TextField>
  )
}

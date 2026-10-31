import { Chip } from '@mui/material'
import { CORES_STATUS, ROTULOS_STATUS } from '../constants/status.ts'
import type { StatusPedido } from '../types/pedido.ts'

export function SeloStatus({ status }: { status: StatusPedido }) {
  return <Chip size="small" variant="outlined" color={CORES_STATUS[status]} label={ROTULOS_STATUS[status]} />
}

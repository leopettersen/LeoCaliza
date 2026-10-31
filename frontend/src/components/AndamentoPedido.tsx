import { Box, Typography, type SxProps, type Theme } from '@mui/material'
import { ESTADOS_ETAPA } from '../constants/status.ts'
import type { EstadoEtapa, EtapaAndamento } from '../utils/andamentoPedido.ts'

export function AndamentoPedido({ etapas }: { etapas: EtapaAndamento[] }) {
  return (
    <Box component="ol" sx={estilos.lista}>
      {etapas.map((etapa) => (
        <Box component="li" key={etapa.rotulo} sx={estilos.etapa}>
          <Box sx={{ ...estilos.marcador, ...ESTILOS_MARCADOR[etapa.estado] }} />
          <Typography color={etapa.estado === ESTADOS_ETAPA.pendente ? 'text.secondary' : 'text.primary'}>
            {etapa.rotulo}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

const ESTILOS_MARCADOR = {
  [ESTADOS_ETAPA.concluida]: { bgcolor: 'success.main', borderColor: 'success.main' },
  [ESTADOS_ETAPA.atual]: { bgcolor: 'secondary.main', borderColor: 'secondary.main', boxShadow: 3 },
  [ESTADOS_ETAPA.pendente]: { bgcolor: 'background.paper', borderColor: 'divider' },
  [ESTADOS_ETAPA.erro]: { bgcolor: 'error.main', borderColor: 'error.main' },
} satisfies Record<EstadoEtapa, SxProps<Theme>>

const estilos = {
  lista: {
    listStyle: 'none',
    m: 0,
    p: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  etapa: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  },
  marcador: {
    width: 20,
    height: 20,
    flexShrink: 0,
    borderRadius: '50%',
    border: 2,
  },
} satisfies Record<string, SxProps<Theme>>

import { Box, CircularProgress, type SxProps, type Theme } from '@mui/material'
import { TEXTOS } from '../constants/textos.ts'

export function Carregando() {
  return (
    <Box sx={estilos.container} role="status" aria-label={TEXTOS.geral.carregando}>
      <CircularProgress />
    </Box>
  )
}

const estilos = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    py: 6,
  },
} satisfies Record<string, SxProps<Theme>>

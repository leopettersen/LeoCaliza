import { Box, Paper, Typography, type SxProps, type Theme } from '@mui/material'
import type { ReactNode } from 'react'

interface PropriedadesSecaoFormulario {
  titulo: string
  acao?: ReactNode
  children: ReactNode
}

export function SecaoFormulario({ titulo, acao, children }: PropriedadesSecaoFormulario) {
  return (
    <Paper variant="outlined" sx={estilos.secao}>
      <Box sx={estilos.cabecalho}>
        <Typography variant="h6" component="h2">
          {titulo}
        </Typography>
        {acao}
      </Box>
      <Box sx={estilos.conteudo}>{children}</Box>
    </Paper>
  )
}

const estilos = {
  secao: {
    p: 3,
  },
  cabecalho: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    mb: 2,
  },
  conteudo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
} satisfies Record<string, SxProps<Theme>>

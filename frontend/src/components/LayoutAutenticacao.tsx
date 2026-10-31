import { Box, Paper, Typography, type SxProps, type Theme } from '@mui/material'
import type { ReactNode } from 'react'
import { LARGURAS } from '../constants/estilo.ts'
import { IMAGENS } from '../constants/imagens.ts'
import { TEXTOS } from '../constants/textos.ts'

export function LayoutAutenticacao({ children }: { children: ReactNode }) {
  return (
    <Box sx={estilos.pagina}>
      <Box sx={estilos.painelMarca}>
        <Box sx={estilos.moldura}>
          <Box component="img" sx={estilos.logo} src={IMAGENS.logo} alt={TEXTOS.app.descricaoLogo} />
        </Box>
        <Typography variant="h6" component="p" sx={estilos.slogan}>{TEXTOS.app.slogan}</Typography>
      </Box>
      <Box component="main" sx={estilos.areaFormulario}>
        <Paper variant="outlined" sx={estilos.cartao}>
          {children}
        </Paper>
      </Box>
    </Box>
  )
}

const estilos = {
  pagina: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
    minHeight: '100vh',
  },
  painelMarca: {
    display: { xs: 'none', md: 'flex' },
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    background: (tema) =>
      `linear-gradient(135deg, ${tema.palette.primary.main}, ${tema.palette.secondary.main} 60%, ${tema.palette.success.main})`,
  },
  moldura: {
    borderRadius: 3,
    overflow: 'hidden',
    lineHeight: 0,
    boxShadow: 6,
  },
  logo: {
    width: LARGURAS.logo * 6,
    height: LARGURAS.logo * 6,
    objectFit: 'cover',
  },
  slogan: {
    color: 'primary.contrastText',
  },
  areaFormulario: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 3,
  },
  cartao: {
    width: '100%',
    maxWidth: LARGURAS.formulario,
    p: 4,
  },
} satisfies Record<string, SxProps<Theme>>

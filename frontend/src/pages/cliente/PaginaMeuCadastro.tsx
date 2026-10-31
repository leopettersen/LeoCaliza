import { Box, Typography, type SxProps, type Theme } from '@mui/material'
import { TEXTOS } from '../../constants/textos.ts'

export function PaginaMeuCadastro() {
  return (
    <Box sx={estilos.pagina}>
      <Typography variant="h4" component="h1">
        {TEXTOS.meuCadastro.titulo}
      </Typography>
    </Box>
  )
}

const estilos = {
  pagina: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
} satisfies Record<string, SxProps<Theme>>

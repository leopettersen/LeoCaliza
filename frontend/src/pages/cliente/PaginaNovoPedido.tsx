import { Box, Typography, type SxProps, type Theme } from '@mui/material'
import { TEXTOS } from '../../constants/textos.ts'

export function PaginaNovoPedido() {
  return (
    <Box component="main" sx={estilos.pagina}>
      <Typography variant="h4" component="h1">
        {TEXTOS.novoPedido.titulo}
      </Typography>
    </Box>
  )
}

const estilos = {
  pagina: {
    p: 4,
  },
} satisfies Record<string, SxProps<Theme>>

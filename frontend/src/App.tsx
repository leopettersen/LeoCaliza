import { Box, Typography, type SxProps, type Theme } from '@mui/material'
import { LARGURAS } from './constants/estilo.ts'
import { IMAGENS } from './constants/imagens.ts'
import { TEXTOS } from './constants/textos.ts'

function App() {
  return (
    <Box component="main" sx={estilos.inicio}>
      <Box component="img" sx={estilos.logo} src={IMAGENS.logo} alt={TEXTOS.app.descricaoLogo} />
      <Typography variant="h4" component="h1">
        {TEXTOS.app.nome}
      </Typography>
    </Box>
  )
}

const estilos = {
  inicio: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    p: 4,
  },
  logo: {
    width: LARGURAS.logo,
    height: LARGURAS.logo,
    objectFit: 'contain',
  },
} satisfies Record<string, SxProps<Theme>>

export default App

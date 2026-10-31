import { createTheme } from '@mui/material/styles'
import { CORES } from '../constants/cores.ts'
import { FONTES, PESOS_FONTE, RAIO_BORDA, TAMANHOS_FONTE, UNIDADE_ESPACAMENTO } from '../constants/estilo.ts'

export const tema = createTheme({
  palette: {
    primary: { main: CORES.primaria, dark: CORES.primariaEscura, contrastText: CORES.textoInverso },
    secondary: { main: CORES.secundaria, contrastText: CORES.textoInverso },
    success: { main: CORES.destaque, light: CORES.destaqueClaro, contrastText: CORES.textoInverso },
    error: { main: CORES.erro, light: CORES.erroClaro },
    warning: { main: CORES.alerta, light: CORES.alertaClaro },
    background: { default: CORES.fundo, paper: CORES.superficie },
    text: { primary: CORES.texto, secondary: CORES.textoSuave },
    divider: CORES.borda,
  },
  typography: {
    fontFamily: FONTES.base,
    h4: { fontSize: TAMANHOS_FONTE.titulo, fontWeight: PESOS_FONTE.destaque, color: CORES.primaria },
    h6: { fontSize: TAMANHOS_FONTE.subtitulo, fontWeight: PESOS_FONTE.destaque, color: CORES.primaria },
    body2: { fontSize: TAMANHOS_FONTE.pequeno },
    button: { textTransform: 'none', fontWeight: PESOS_FONTE.destaque },
  },
  shape: { borderRadius: RAIO_BORDA },
  spacing: UNIDADE_ESPACAMENTO,
})

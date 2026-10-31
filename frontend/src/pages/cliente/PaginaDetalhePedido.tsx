import { Alert, Box, Button, Paper, Typography, type SxProps, type Theme } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { AndamentoPedido } from '../../components/AndamentoPedido.tsx'
import { Carregando } from '../../components/Carregando.tsx'
import { ListaDados } from '../../components/ListaDados.tsx'
import { SeloStatus } from '../../components/SeloStatus.tsx'
import { ROTAS } from '../../constants/rotas.ts'
import { TEXTOS } from '../../constants/textos.ts'
import { usePedido } from '../../hooks/usePedido.ts'
import { montarAndamento } from '../../utils/andamentoPedido.ts'
import { montarDadosPedido } from '../../utils/descricaoPedido.ts'
import { formatarNumeroPedido } from '../../utils/formatacao.ts'

export function PaginaDetalhePedido() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { pedido, carregando, erro } = usePedido(Number(id))

  if (carregando) {
    return <Carregando />
  }

  if (erro || !pedido) {
    return (
      <Box sx={estilos.pagina}>
        <Alert severity="error">{erro}</Alert>
        <Box>
          <Button variant="outlined" onClick={() => navegar(ROTAS.cliente.pedidos)}>
            {TEXTOS.detalhePedido.botaoVoltar}
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={estilos.pagina}>
      <Box sx={estilos.cabecalho}>
        <Typography variant="h4" component="h1">
          {TEXTOS.detalhePedido.titulo(formatarNumeroPedido(pedido.id))}
        </Typography>
        <SeloStatus status={pedido.status} />
      </Box>
      <Box sx={estilos.colunas}>
        <Paper variant="outlined" sx={estilos.cartao}>
          <Typography variant="h6" component="h2">
            {TEXTOS.detalhePedido.secaoDados}
          </Typography>
          <ListaDados itens={montarDadosPedido(pedido)} />
        </Paper>
        <Paper variant="outlined" sx={estilos.cartao}>
          <Typography variant="h6" component="h2">
            {TEXTOS.detalhePedido.secaoAndamento}
          </Typography>
          <AndamentoPedido etapas={montarAndamento(pedido)} />
        </Paper>
      </Box>
    </Box>
  )
}

const estilos = {
  pagina: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  cabecalho: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
  },
  colunas: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' },
    alignItems: 'start',
    gap: 3,
  },
  cartao: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    p: 3,
  },
} satisfies Record<string, SxProps<Theme>>

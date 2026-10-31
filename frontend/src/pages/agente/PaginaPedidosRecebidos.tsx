import {
  Alert,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material'
import { useState } from 'react'
import { Carregando } from '../../components/Carregando.tsx'
import { FiltroStatus, TODOS_OS_STATUS, type OpcaoFiltroStatus } from '../../components/FiltroStatus.tsx'
import { SeloStatus } from '../../components/SeloStatus.tsx'
import { LARGURAS } from '../../constants/estilo.ts'
import { STATUS_PEDIDO } from '../../constants/status.ts'
import { TEXTOS } from '../../constants/textos.ts'
import { usePedidos } from '../../hooks/usePedidos.ts'
import { descreverModelo, formatarMoeda } from '../../utils/formatacao.ts'

export function PaginaPedidosRecebidos() {
  const [status, setStatus] = useState<OpcaoFiltroStatus>(TODOS_OS_STATUS)
  const [selecionadoId, setSelecionadoId] = useState<number | null>(null)
  const { pedidos, carregando, erro } = usePedidos(status || undefined)
  const pedidoSelecionado = pedidos.find((pedido) => pedido.id === selecionadoId) ?? null

  return (
    <Box sx={estilos.pagina}>
      <Typography variant="h4" component="h1">
        {TEXTOS.pedidosRecebidos.titulo}
      </Typography>
      <Box sx={estilos.filtro}>
        <FiltroStatus valor={status} aoAlterar={setStatus} />
      </Box>
      {erro && <Alert severity="error">{erro}</Alert>}
      <Box sx={estilos.colunas}>
        {carregando ? (
          <Carregando />
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={estilos.linhaCabecalho}>
                  <TableCell>{TEXTOS.pedidosRecebidos.colunaCliente}</TableCell>
                  <TableCell>{TEXTOS.pedidosRecebidos.colunaAutomovel}</TableCell>
                  <TableCell>{TEXTOS.pedidosRecebidos.colunaRendaTotal}</TableCell>
                  <TableCell>{TEXTOS.pedidosRecebidos.colunaCredito}</TableCell>
                  <TableCell>{TEXTOS.pedidosRecebidos.colunaStatus}</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={estilos.vazio}>
                      {TEXTOS.pedidosRecebidos.nenhumPedido}
                    </TableCell>
                  </TableRow>
                )}
                {pedidos.map((pedido) => (
                  <TableRow key={pedido.id} hover selected={pedido.id === selecionadoId}>
                    <TableCell>{pedido.cliente.nome}</TableCell>
                    <TableCell>{descreverModelo(pedido.automovel)}</TableCell>
                    <TableCell>{formatarMoeda(pedido.rendaTotal)}</TableCell>
                    <TableCell>{pedido.bancoCreditoId ? TEXTOS.geral.sim : TEXTOS.geral.nao}</TableCell>
                    <TableCell>
                      <SeloStatus status={pedido.status} />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" onClick={() => setSelecionadoId(pedido.id)}>
                        {pedido.status === STATUS_PEDIDO.emAnalise
                          ? TEXTOS.pedidosRecebidos.botaoAvaliar
                          : TEXTOS.pedidosRecebidos.botaoDetalhes}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Paper variant="outlined" sx={estilos.painel}>
          <Typography variant="h6" component="h2">
            {TEXTOS.pedidosRecebidos.secaoAvaliacao}
          </Typography>
          {!pedidoSelecionado && (
            <Typography variant="body2" color="text.secondary">
              {TEXTOS.pedidosRecebidos.painelVazio}
            </Typography>
          )}
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
  filtro: {
    maxWidth: LARGURAS.painelResumo,
    display: 'flex',
    flexDirection: 'column',
  },
  colunas: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', lg: `1fr ${LARGURAS.painelResumo}px` },
    alignItems: 'start',
    gap: 3,
  },
  linhaCabecalho: {
    bgcolor: 'background.default',
    '& th, & ~ tr td': {
      py: 1.5,
    },
    '& th': {
      fontWeight: 'fontWeightBold',
    },
  },
  vazio: {
    textAlign: 'center',
    color: 'text.secondary',
    py: 4,
  },
  painel: {
    position: { lg: 'sticky' },
    top: { lg: 96 },
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    p: 3,
  },
} satisfies Record<string, SxProps<Theme>>

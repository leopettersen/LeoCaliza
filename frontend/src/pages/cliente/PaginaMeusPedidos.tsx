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
  TextField,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AcoesPedido } from '../../components/AcoesPedido.tsx'
import { Carregando } from '../../components/Carregando.tsx'
import { FiltroStatus, TODOS_OS_STATUS, type OpcaoFiltroStatus } from '../../components/FiltroStatus.tsx'
import { SeloStatus } from '../../components/SeloStatus.tsx'
import { ROTAS } from '../../constants/rotas.ts'
import { TEXTOS } from '../../constants/textos.ts'
import { usePedidos } from '../../hooks/usePedidos.ts'
import { obterCaminhoDetalhePedido } from '../../routes/caminhos.ts'
import type { Pedido } from '../../types/pedido.ts'
import { descreverAutomovel, formatarNumeroPedido, formatarPeriodo } from '../../utils/formatacao.ts'

function correspondeABusca(pedido: Pedido, busca: string) {
  const termo = busca.trim().toLowerCase()
  if (!termo) {
    return true
  }
  const { marca, modelo, placa } = pedido.automovel
  return [formatarNumeroPedido(pedido.id), String(pedido.id), marca, modelo, placa].some((valor) =>
    valor.toLowerCase().includes(termo),
  )
}

export function PaginaMeusPedidos() {
  const navegar = useNavigate()
  const [status, setStatus] = useState<OpcaoFiltroStatus>(TODOS_OS_STATUS)
  const [busca, setBusca] = useState('')
  const { pedidos, carregando, erro, recarregar } = usePedidos(status || undefined)
  const pedidosFiltrados = useMemo(
    () => pedidos.filter((pedido) => correspondeABusca(pedido, busca)),
    [pedidos, busca],
  )

  return (
    <Box sx={estilos.pagina}>
      <Box sx={estilos.cabecalho}>
        <Typography variant="h4" component="h1">
          {TEXTOS.meusPedidos.titulo}
        </Typography>
        <Button variant="contained" size="large" onClick={() => navegar(ROTAS.cliente.novoPedido)}>
          {TEXTOS.meusPedidos.botaoNovoPedido}
        </Button>
      </Box>
      <Box sx={estilos.filtros}>
        <FiltroStatus valor={status} aoAlterar={setStatus} />
        <TextField
          label={TEXTOS.meusPedidos.filtroBusca}
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
        />
      </Box>
      {erro && <Alert severity="error">{erro}</Alert>}
      {carregando ? (
        <Carregando />
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={estilos.linhaCabecalho}>
                <TableCell>{TEXTOS.meusPedidos.colunaNumero}</TableCell>
                <TableCell>{TEXTOS.meusPedidos.colunaAutomovel}</TableCell>
                <TableCell>{TEXTOS.meusPedidos.colunaPeriodo}</TableCell>
                <TableCell>{TEXTOS.meusPedidos.colunaStatus}</TableCell>
                <TableCell>{TEXTOS.meusPedidos.colunaAcoes}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} sx={estilos.vazio}>
                    {TEXTOS.meusPedidos.nenhumPedido}
                  </TableCell>
                </TableRow>
              )}
              {pedidosFiltrados.map((pedido) => (
                <TableRow key={pedido.id} hover>
                  <TableCell>{formatarNumeroPedido(pedido.id)}</TableCell>
                  <TableCell>{descreverAutomovel(pedido.automovel)}</TableCell>
                  <TableCell>{formatarPeriodo(pedido.dataRetirada, pedido.dataDevolucao)}</TableCell>
                  <TableCell>
                    <SeloStatus status={pedido.status} />
                  </TableCell>
                  <TableCell>
                    <Box sx={estilos.acoes}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navegar(obterCaminhoDetalhePedido(pedido.id))}
                      >
                        {TEXTOS.meusPedidos.botaoVer}
                      </Button>
                      <AcoesPedido pedido={pedido} aoCancelar={recarregar} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Typography variant="body2" color="text.secondary" sx={estilos.legenda}>
        {TEXTOS.meusPedidos.legendaStatus}
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
  cabecalho: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 2,
  },
  filtros: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
    gap: 2,
  },
  linhaCabecalho: {
    bgcolor: 'background.default',
    '& th': {
      fontWeight: 'fontWeightBold',
    },
  },
  vazio: {
    textAlign: 'center',
    color: 'text.secondary',
    py: 4,
  },
  acoes: {
    display: 'flex',
    gap: 1,
  },
  legenda: {
    borderLeft: 3,
    borderColor: 'divider',
    pl: 1.5,
  },
} satisfies Record<string, SxProps<Theme>>

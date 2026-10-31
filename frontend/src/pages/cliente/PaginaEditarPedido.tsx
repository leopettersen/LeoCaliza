import { Alert, Box, Button, Typography, type SxProps, type Theme } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { Carregando } from '../../components/Carregando.tsx'
import { FormularioPedido } from '../../components/FormularioPedido.tsx'
import { ROTAS } from '../../constants/rotas.ts'
import { TEXTOS } from '../../constants/textos.ts'
import { usePedido } from '../../hooks/usePedido.ts'
import { obterCaminhoDetalhePedido } from '../../routes/caminhos.ts'
import { modificarPedido } from '../../services/pedidoService.ts'
import type { DadosPedido } from '../../types/pedido.ts'
import { formatarNumeroPedido } from '../../utils/formatacao.ts'
import { paraValoresFormulario } from '../../utils/formularioPedido.ts'
import { podeModificar } from '../../utils/regrasPedido.ts'

export function PaginaEditarPedido() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { pedido, carregando, erro } = usePedido(Number(id))

  if (carregando) {
    return <Carregando />
  }

  if (erro || !pedido || !podeModificar(pedido)) {
    return (
      <Box sx={estilos.pagina}>
        <Alert severity={erro ? 'error' : 'info'}>{erro ?? TEXTOS.editarPedido.naoModificavel}</Alert>
        <Box>
          <Button variant="outlined" onClick={() => navegar(ROTAS.cliente.pedidos)}>
            {TEXTOS.detalhePedido.botaoVoltar}
          </Button>
        </Box>
      </Box>
    )
  }

  async function salvarAlteracoes(dados: DadosPedido) {
    const atualizado = await modificarPedido(Number(id), dados)
    navegar(obterCaminhoDetalhePedido(atualizado.id))
  }

  return (
    <Box sx={estilos.pagina}>
      <Typography variant="h4" component="h1">
        {TEXTOS.editarPedido.titulo(formatarNumeroPedido(pedido.id))}
      </Typography>
      <FormularioPedido
        valoresIniciais={paraValoresFormulario(pedido)}
        rotuloEnviar={TEXTOS.editarPedido.botaoSalvar}
        aoEnviar={salvarAlteracoes}
        aoCancelar={() => navegar(obterCaminhoDetalhePedido(pedido.id))}
      />
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

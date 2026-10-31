import { Box, Typography, type SxProps, type Theme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { FormularioPedido } from '../../components/FormularioPedido.tsx'
import { ROTAS } from '../../constants/rotas.ts'
import { TEXTOS } from '../../constants/textos.ts'
import { obterCaminhoDetalhePedido } from '../../routes/caminhos.ts'
import { criarPedido } from '../../services/pedidoService.ts'
import type { DadosPedido } from '../../types/pedido.ts'
import { VALORES_INICIAIS_PEDIDO } from '../../utils/formularioPedido.ts'

export function PaginaNovoPedido() {
  const navegar = useNavigate()

  async function enviarPedido(dados: DadosPedido) {
    const pedido = await criarPedido(dados)
    navegar(obterCaminhoDetalhePedido(pedido.id))
  }

  return (
    <Box sx={estilos.pagina}>
      <Typography variant="h4" component="h1">
        {TEXTOS.novoPedido.titulo}
      </Typography>
      <FormularioPedido
        valoresIniciais={VALORES_INICIAIS_PEDIDO}
        rotuloEnviar={TEXTOS.novoPedido.botaoEnviar}
        aoEnviar={enviarPedido}
        aoCancelar={() => navegar(ROTAS.cliente.pedidos)}
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

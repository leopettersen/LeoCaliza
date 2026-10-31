import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material'
import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PERFIS } from '../constants/perfis.ts'
import { OPCOES_PARECER } from '../constants/status.ts'
import { TEXTOS } from '../constants/textos.ts'
import { REGRAS_VALIDACAO } from '../constants/validacao.ts'
import { obterCaminhoEditarPedido } from '../routes/caminhos.ts'
import { extrairMensagemDeErro } from '../services/api.ts'
import { avaliarPedido } from '../services/pedidoService.ts'
import type { Pedido } from '../types/pedido.ts'
import { montarDadosPedido } from '../utils/descricaoPedido.ts'
import { formatarMoeda } from '../utils/formatacao.ts'
import { podeAvaliar, podeModificar } from '../utils/regrasPedido.ts'
import { ListaDados, type ItemDado } from './ListaDados.tsx'

type OpcaoParecer = (typeof OPCOES_PARECER)[keyof typeof OPCOES_PARECER]

interface PropriedadesPainelAvaliacao {
  pedido: Pedido
  aoAtualizar: () => void
}

function montarDadosCliente(pedido: Pedido): ItemDado[] {
  const { cliente } = pedido
  return [
    { rotulo: TEXTOS.camposCliente.nome, valor: cliente.nome },
    { rotulo: TEXTOS.camposCliente.cpf, valor: cliente.cpf },
    { rotulo: TEXTOS.camposCliente.rg, valor: cliente.rg },
    { rotulo: TEXTOS.camposCliente.profissao, valor: cliente.profissao },
    { rotulo: TEXTOS.camposCliente.endereco, valor: cliente.endereco },
  ]
}

function montarRendimentos(pedido: Pedido): ItemDado[] {
  return [
    ...pedido.cliente.rendimentos.map((rendimento) => ({
      rotulo: rendimento.entidadeEmpregadora,
      valor: formatarMoeda(rendimento.valor),
    })),
    { rotulo: TEXTOS.painelAvaliacao.rotuloRendaTotal, valor: formatarMoeda(pedido.rendaTotal) },
  ]
}

export function PainelAvaliacao({ pedido, aoAtualizar }: PropriedadesPainelAvaliacao) {
  const navegar = useNavigate()
  const [parecer, setParecer] = useState<OpcaoParecer>(OPCOES_PARECER.positivo)
  const [observacao, setObservacao] = useState('')
  const [registrando, setRegistrando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  async function registrarParecer(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault()
    setErro(null)
    setSucesso(null)
    setRegistrando(true)
    try {
      await avaliarPedido(pedido.id, {
        resultado: parecer === OPCOES_PARECER.positivo,
        observacao: observacao.trim(),
      })
      setSucesso(TEXTOS.painelAvaliacao.parecerRegistrado)
      aoAtualizar()
    } catch (falha) {
      setErro(extrairMensagemDeErro(falha))
    } finally {
      setRegistrando(false)
    }
  }

  return (
    <Box sx={estilos.painel}>
      <Typography variant="subtitle2" color="text.secondary">
        {TEXTOS.painelAvaliacao.secaoCliente}
      </Typography>
      <ListaDados itens={montarDadosCliente(pedido)} />
      <Typography variant="subtitle2" color="text.secondary">
        {TEXTOS.painelAvaliacao.secaoRendimentos}
      </Typography>
      {pedido.cliente.rendimentos.length === 0 && (
        <Typography variant="body2">{TEXTOS.painelAvaliacao.semRendimentos}</Typography>
      )}
      <ListaDados itens={montarRendimentos(pedido)} />
      <Typography variant="subtitle2" color="text.secondary">
        {TEXTOS.painelAvaliacao.secaoPedido}
      </Typography>
      <ListaDados itens={montarDadosPedido(pedido)} />
      <Divider />
      {sucesso && <Alert severity="success">{sucesso}</Alert>}
      {erro && <Alert severity="error">{erro}</Alert>}
      {podeAvaliar(pedido) ? (
        <Box component="form" onSubmit={registrarParecer} sx={estilos.formulario}>
          <FormControl>
            <FormLabel>{TEXTOS.painelAvaliacao.campoParecer}</FormLabel>
            <RadioGroup row value={parecer} onChange={(evento) => setParecer(evento.target.value as OpcaoParecer)}>
              <FormControlLabel
                value={OPCOES_PARECER.positivo}
                control={<Radio />}
                label={TEXTOS.painelAvaliacao.parecerPositivo}
              />
              <FormControlLabel
                value={OPCOES_PARECER.negativo}
                control={<Radio />}
                label={TEXTOS.painelAvaliacao.parecerNegativo}
              />
            </RadioGroup>
          </FormControl>
          <TextField
            label={TEXTOS.painelAvaliacao.campoObservacoes}
            value={observacao}
            onChange={(evento) => setObservacao(evento.target.value)}
            slotProps={{ htmlInput: { maxLength: REGRAS_VALIDACAO.tamanhoMaximoObservacao } }}
            multiline
            minRows={2}
            required
          />
          <Button type="submit" variant="contained" size="large" disabled={registrando} fullWidth>
            {registrando ? TEXTOS.painelAvaliacao.registrando : TEXTOS.painelAvaliacao.botaoRegistrar}
          </Button>
        </Box>
      ) : (
        !sucesso && <Alert severity="info">{TEXTOS.painelAvaliacao.avaliacaoIndisponivel}</Alert>
      )}
      <Button
        variant="outlined"
        size="large"
        disabled={!podeModificar(pedido)}
        onClick={() => navegar(obterCaminhoEditarPedido(pedido.id, PERFIS.agente))}
        fullWidth
      >
        {TEXTOS.painelAvaliacao.botaoModificar}
      </Button>
    </Box>
  )
}

const estilos = {
  painel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
} satisfies Record<string, SxProps<Theme>>

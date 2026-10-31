import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material'
import { useState, type ChangeEvent, type SubmitEvent } from 'react'
import { LARGURAS } from '../constants/estilo.ts'
import { FORMATOS } from '../constants/formatos.ts'
import { TIPOS_PROPRIETARIO } from '../constants/perfis.ts'
import { ROTULOS_TIPO_PROPRIETARIO } from '../constants/rotulos.ts'
import { TEXTOS } from '../constants/textos.ts'
import { REGRAS_VALIDACAO } from '../constants/validacao.ts'
import { useAgentes } from '../hooks/useAgentes.ts'
import { extrairMensagemDeErro } from '../services/api.ts'
import type { Agente } from '../types/agente.ts'
import type { DadosPedido, TipoProprietario } from '../types/pedido.ts'
import { obterDataDeHojeIso } from '../utils/datas.ts'
import { formatarPeriodo } from '../utils/formatacao.ts'
import { SEM_SELECAO, paraDadosPedido, type ValoresFormularioPedido } from '../utils/formularioPedido.ts'
import { SecaoFormulario } from './SecaoFormulario.tsx'

type CampoTexto = 'marca' | 'modelo' | 'ano' | 'placa' | 'matricula' | 'dataRetirada' | 'dataDevolucao' | 'proprietarioId' | 'bancoCreditoId'

interface PropriedadesFormularioPedido {
  valoresIniciais: ValoresFormularioPedido
  rotuloEnviar: string
  aoEnviar: (dados: DadosPedido) => Promise<void>
  aoCancelar: () => void
  rotuloClienteProprietario?: string
  avisoResumo?: string
}

function buscarNomeAgente(agentes: Agente[], id: string) {
  return agentes.find((agente) => String(agente.id) === id)?.nome ?? TEXTOS.formularioPedido.naoInformado
}

export function FormularioPedido({
  valoresIniciais,
  rotuloEnviar,
  aoEnviar,
  aoCancelar,
  rotuloClienteProprietario = TEXTOS.formularioPedido.voceMesmo,
  avisoResumo = TEXTOS.formularioPedido.avisoResumo,
}: PropriedadesFormularioPedido) {
  const { empresas, bancos, erro: erroAgentes } = useAgentes()
  const [valores, setValores] = useState(valoresIniciais)
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const hoje = obterDataDeHojeIso()
  const proprietarioEhAgente = valores.tipoProprietario !== TIPOS_PROPRIETARIO.cliente
  const agentesProprietarios = valores.tipoProprietario === TIPOS_PROPRIETARIO.banco ? bancos : empresas

  function alterarCampo(campo: CampoTexto) {
    return (evento: ChangeEvent<HTMLInputElement>) =>
      setValores((atuais) => ({ ...atuais, [campo]: evento.target.value }))
  }

  function alterarTipoProprietario(tipo: TipoProprietario) {
    setValores((atuais) => ({ ...atuais, tipoProprietario: tipo, proprietarioId: SEM_SELECAO }))
  }

  function alterarAssociarCredito(associar: boolean) {
    setValores((atuais) => ({ ...atuais, associarCredito: associar, bancoCreditoId: SEM_SELECAO }))
  }

  function descreverProprietario() {
    if (!proprietarioEhAgente) {
      return rotuloClienteProprietario
    }
    return TEXTOS.formularioPedido.descricaoProprietario(
      ROTULOS_TIPO_PROPRIETARIO[valores.tipoProprietario],
      buscarNomeAgente(agentesProprietarios, valores.proprietarioId),
    )
  }

  async function enviar(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault()
    setErro(null)
    if (valores.dataDevolucao <= valores.dataRetirada) {
      setErro(TEXTOS.formularioPedido.devolucaoAntesDaRetirada)
      return
    }
    setEnviando(true)
    try {
      await aoEnviar(paraDadosPedido(valores))
    } catch (falha) {
      setErro(extrairMensagemDeErro(falha))
    } finally {
      setEnviando(false)
    }
  }

  const itensResumo = [
    {
      rotulo: TEXTOS.formularioPedido.resumoAutomovel,
      valor:
        [valores.marca, valores.modelo, valores.placa].filter(Boolean).join(FORMATOS.separadorPalavras) ||
        TEXTOS.formularioPedido.naoInformado,
    },
    { rotulo: TEXTOS.formularioPedido.resumoAno, valor: valores.ano || TEXTOS.formularioPedido.naoInformado },
    {
      rotulo: TEXTOS.formularioPedido.resumoPeriodo,
      valor:
        valores.dataRetirada && valores.dataDevolucao
          ? formatarPeriodo(valores.dataRetirada, valores.dataDevolucao)
          : TEXTOS.formularioPedido.naoInformado,
    },
    { rotulo: TEXTOS.formularioPedido.resumoProprietario, valor: descreverProprietario() },
    {
      rotulo: TEXTOS.formularioPedido.resumoCredito,
      valor: valores.associarCredito
        ? buscarNomeAgente(bancos, valores.bancoCreditoId)
        : TEXTOS.formularioPedido.semCredito,
    },
  ]

  return (
    <Box component="form" onSubmit={enviar} sx={estilos.layout}>
      <Box sx={estilos.secoes}>
        {erroAgentes && <Alert severity="error">{erroAgentes}</Alert>}
        <SecaoFormulario titulo={TEXTOS.formularioPedido.secaoAutomovel}>
          <Box sx={estilos.linhaDupla}>
            <TextField
              label={TEXTOS.formularioPedido.campoMarca}
              value={valores.marca}
              onChange={alterarCampo('marca')}
              slotProps={{ htmlInput: { maxLength: REGRAS_VALIDACAO.tamanhoMaximoMarcaModelo } }}
              required
            />
            <TextField
              label={TEXTOS.formularioPedido.campoModelo}
              value={valores.modelo}
              onChange={alterarCampo('modelo')}
              slotProps={{ htmlInput: { maxLength: REGRAS_VALIDACAO.tamanhoMaximoMarcaModelo } }}
              required
            />
          </Box>
          <Box sx={estilos.linhaTripla}>
            <TextField
              label={TEXTOS.formularioPedido.campoAno}
              type="number"
              value={valores.ano}
              onChange={alterarCampo('ano')}
              slotProps={{
                htmlInput: {
                  min: REGRAS_VALIDACAO.anoMinimoAutomovel,
                  max: REGRAS_VALIDACAO.anoMaximoAutomovel,
                },
              }}
              required
            />
            <TextField
              label={TEXTOS.formularioPedido.campoPlaca}
              value={valores.placa}
              onChange={alterarCampo('placa')}
              slotProps={{ htmlInput: { maxLength: REGRAS_VALIDACAO.tamanhoMaximoPlaca } }}
              required
            />
            <TextField
              label={TEXTOS.formularioPedido.campoMatricula}
              value={valores.matricula}
              onChange={alterarCampo('matricula')}
              slotProps={{ htmlInput: { maxLength: REGRAS_VALIDACAO.tamanhoMaximoMatricula } }}
              required
            />
          </Box>
        </SecaoFormulario>

        <SecaoFormulario titulo={TEXTOS.formularioPedido.secaoPeriodo}>
          <Box sx={estilos.linhaDupla}>
            <TextField
              label={TEXTOS.formularioPedido.campoRetirada}
              type="date"
              value={valores.dataRetirada}
              onChange={alterarCampo('dataRetirada')}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: hoje } }}
              required
            />
            <TextField
              label={TEXTOS.formularioPedido.campoDevolucao}
              type="date"
              value={valores.dataDevolucao}
              onChange={alterarCampo('dataDevolucao')}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: valores.dataRetirada || hoje } }}
              required
            />
          </Box>
          <FormControl>
            <FormLabel>{TEXTOS.formularioPedido.campoProprietario}</FormLabel>
            <RadioGroup
              row
              value={valores.tipoProprietario}
              onChange={(evento) => alterarTipoProprietario(evento.target.value as TipoProprietario)}
            >
              {Object.values(TIPOS_PROPRIETARIO).map((tipo) => (
                <FormControlLabel key={tipo} value={tipo} control={<Radio />} label={ROTULOS_TIPO_PROPRIETARIO[tipo]} />
              ))}
            </RadioGroup>
          </FormControl>
          {proprietarioEhAgente && (
            <TextField
              select
              label={
                valores.tipoProprietario === TIPOS_PROPRIETARIO.banco
                  ? TEXTOS.formularioPedido.campoBancoProprietario
                  : TEXTOS.formularioPedido.campoEmpresaProprietaria
              }
              value={valores.proprietarioId}
              onChange={alterarCampo('proprietarioId')}
              helperText={agentesProprietarios.length === 0 ? TEXTOS.formularioPedido.nenhumAgente : undefined}
              required
            >
              {agentesProprietarios.map((agente) => (
                <MenuItem key={agente.id} value={String(agente.id)}>
                  {agente.nome}
                </MenuItem>
              ))}
            </TextField>
          )}
        </SecaoFormulario>

        <SecaoFormulario titulo={TEXTOS.formularioPedido.secaoCredito}>
          <FormControlLabel
            control={
              <Checkbox
                checked={valores.associarCredito}
                onChange={(evento) => alterarAssociarCredito(evento.target.checked)}
              />
            }
            label={TEXTOS.formularioPedido.associarCredito}
          />
          <TextField
            select
            label={TEXTOS.formularioPedido.campoBancoCredito}
            value={valores.bancoCreditoId}
            onChange={alterarCampo('bancoCreditoId')}
            disabled={!valores.associarCredito}
            helperText={bancos.length === 0 ? TEXTOS.formularioPedido.nenhumAgente : undefined}
            required={valores.associarCredito}
          >
            {bancos.map((banco) => (
              <MenuItem key={banco.id} value={String(banco.id)}>
                {banco.nome}
              </MenuItem>
            ))}
          </TextField>
        </SecaoFormulario>
      </Box>

      <Paper variant="outlined" sx={estilos.resumo}>
        <Typography variant="h6" component="h2">
          {TEXTOS.formularioPedido.secaoResumo}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {avisoResumo}
        </Typography>
        <Box sx={estilos.itensResumo}>
          {itensResumo.map((item) => (
            <Box key={item.rotulo}>
              <Typography variant="body2" color="text.secondary">
                {item.rotulo}
              </Typography>
              <Typography>{item.valor}</Typography>
            </Box>
          ))}
        </Box>
        {erro && <Alert severity="error">{erro}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={enviando} fullWidth>
          {enviando ? TEXTOS.formularioPedido.enviando : rotuloEnviar}
        </Button>
        <Button variant="outlined" size="large" onClick={aoCancelar} disabled={enviando} fullWidth>
          {TEXTOS.formularioPedido.botaoCancelar}
        </Button>
      </Paper>
    </Box>
  )
}

const estilos = {
  layout: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: `1fr ${LARGURAS.painelResumo}px` },
    alignItems: 'start',
    gap: 3,
  },
  secoes: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  linhaDupla: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
    gap: 2,
  },
  linhaTripla: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
    gap: 2,
  },
  resumo: {
    position: { md: 'sticky' },
    top: { md: 96 },
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    p: 3,
  },
  itensResumo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
    p: 2,
    borderRadius: 1,
    bgcolor: 'background.default',
  },
} satisfies Record<string, SxProps<Theme>>

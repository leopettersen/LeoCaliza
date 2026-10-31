import {
  Alert,
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material'
import { useState, type ChangeEvent, type SubmitEvent } from 'react'
import { Carregando } from '../../components/Carregando.tsx'
import { DialogoConfirmacao } from '../../components/DialogoConfirmacao.tsx'
import { SecaoFormulario } from '../../components/SecaoFormulario.tsx'
import { TEXTOS } from '../../constants/textos.ts'
import { REGRAS_VALIDACAO } from '../../constants/validacao.ts'
import { useAutenticacao } from '../../hooks/useAutenticacao.ts'
import { useMeuCadastro } from '../../hooks/useMeuCadastro.ts'
import { extrairMensagemDeErro } from '../../services/api.ts'
import { atualizarMeuCadastro, excluirMinhaConta } from '../../services/clienteService.ts'
import type { Cliente, DadosCliente } from '../../types/cliente.ts'

type CampoIdentificacao = 'nome' | 'cpf' | 'rg' | 'endereco' | 'profissao'

type CampoRendimento = 'entidadeEmpregadora' | 'valor'

interface RendimentoEmEdicao {
  chave: string
  entidadeEmpregadora: string
  valor: string
}

function criarRendimentoVazio(): RendimentoEmEdicao {
  return { chave: crypto.randomUUID(), entidadeEmpregadora: '', valor: '' }
}

function paraRendimentosEmEdicao(cliente: Cliente): RendimentoEmEdicao[] {
  return cliente.rendimentos.map((rendimento) => ({
    chave: crypto.randomUUID(),
    entidadeEmpregadora: rendimento.entidadeEmpregadora,
    valor: String(rendimento.valor),
  }))
}

function paraIdentificacao(cliente: Cliente) {
  return {
    nome: cliente.nome,
    cpf: cliente.cpf,
    rg: cliente.rg,
    endereco: cliente.endereco,
    profissao: cliente.profissao,
  }
}

export function PaginaMeuCadastro() {
  const { cliente, carregando, erro } = useMeuCadastro()

  return (
    <Box sx={estilos.pagina}>
      <Typography variant="h4" component="h1">
        {TEXTOS.meuCadastro.titulo}
      </Typography>
      {carregando && <Carregando />}
      {erro && <Alert severity="error">{erro}</Alert>}
      {cliente && !carregando && <FormularioMeuCadastro cliente={cliente} />}
    </Box>
  )
}

function FormularioMeuCadastro({ cliente }: { cliente: Cliente }) {
  const { sair } = useAutenticacao()
  const [clienteSalvo, setClienteSalvo] = useState(cliente)
  const [identificacao, setIdentificacao] = useState(() => paraIdentificacao(cliente))
  const [rendimentos, setRendimentos] = useState(() => paraRendimentosEmEdicao(cliente))
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const atingiuLimite = rendimentos.length >= REGRAS_VALIDACAO.maximoRendimentos

  function alterarCampo(campo: CampoIdentificacao) {
    return (evento: ChangeEvent<HTMLInputElement>) =>
      setIdentificacao((atual) => ({ ...atual, [campo]: evento.target.value }))
  }

  function preencherCom(dados: Cliente) {
    setIdentificacao(paraIdentificacao(dados))
    setRendimentos(paraRendimentosEmEdicao(dados))
  }

  function montarDadosCliente(): DadosCliente {
    return {
      ...identificacao,
      rendimentos: rendimentos.map((rendimento) => ({
        entidadeEmpregadora: rendimento.entidadeEmpregadora.trim(),
        valor: Number(rendimento.valor),
      })),
    }
  }

  async function salvar(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault()
    setErro(null)
    setSucesso(null)
    setSalvando(true)
    try {
      const atualizado = await atualizarMeuCadastro(montarDadosCliente())
      setClienteSalvo(atualizado)
      preencherCom(atualizado)
      setSucesso(TEXTOS.meuCadastro.cadastroAtualizado)
    } catch (falha) {
      setErro(extrairMensagemDeErro(falha))
    } finally {
      setSalvando(false)
    }
  }

  function descartar() {
    setErro(null)
    setSucesso(null)
    preencherCom(clienteSalvo)
  }

  async function excluirConta() {
    setExcluindo(true)
    try {
      await excluirMinhaConta()
      sair(TEXTOS.meuCadastro.contaExcluida)
    } catch (falha) {
      setErro(extrairMensagemDeErro(falha))
      setConfirmandoExclusao(false)
      setExcluindo(false)
    }
  }

  function adicionarRendimento() {
    if (!atingiuLimite) {
      setRendimentos((atuais) => [...atuais, criarRendimentoVazio()])
    }
  }

  function removerRendimento(chave: string) {
    setRendimentos((atuais) => atuais.filter((rendimento) => rendimento.chave !== chave))
  }

  function alterarRendimento(chave: string, campo: CampoRendimento) {
    return (evento: ChangeEvent<HTMLInputElement>) =>
      setRendimentos((atuais) =>
        atuais.map((rendimento) =>
          rendimento.chave === chave ? { ...rendimento, [campo]: evento.target.value } : rendimento,
        ),
      )
  }

  return (
    <Box component="form" onSubmit={salvar} sx={estilos.formulario}>
      {sucesso && <Alert severity="success">{sucesso}</Alert>}
      {erro && <Alert severity="error">{erro}</Alert>}
      <SecaoFormulario titulo={TEXTOS.meuCadastro.secaoIdentificacao}>
        <Box sx={estilos.linhaTripla}>
          <TextField
            label={TEXTOS.camposCliente.nome}
            value={identificacao.nome}
            onChange={alterarCampo('nome')}
            required
          />
          <TextField
            label={TEXTOS.camposCliente.cpf}
            placeholder={TEXTOS.camposCliente.exemploCpf}
            value={identificacao.cpf}
            onChange={alterarCampo('cpf')}
            required
          />
          <TextField
            label={TEXTOS.camposCliente.rg}
            value={identificacao.rg}
            onChange={alterarCampo('rg')}
            required
          />
        </Box>
        <TextField
          label={TEXTOS.camposCliente.endereco}
          value={identificacao.endereco}
          onChange={alterarCampo('endereco')}
          required
          fullWidth
        />
        <TextField
          label={TEXTOS.camposCliente.profissao}
          value={identificacao.profissao}
          onChange={alterarCampo('profissao')}
          required
          fullWidth
        />
      </SecaoFormulario>
      <SecaoFormulario
        titulo={TEXTOS.meuCadastro.secaoRendimentos(REGRAS_VALIDACAO.maximoRendimentos)}
        acao={
          <Button variant="outlined" onClick={adicionarRendimento} disabled={atingiuLimite}>
            {TEXTOS.meuCadastro.botaoAdicionarRendimento}
          </Button>
        }
      >
        {rendimentos.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            {TEXTOS.meuCadastro.semRendimentos}
          </Typography>
        )}
        {rendimentos.map((rendimento) => (
          <Box key={rendimento.chave} sx={estilos.linhaRendimento}>
            <TextField
              label={TEXTOS.meuCadastro.campoEntidadeEmpregadora}
              value={rendimento.entidadeEmpregadora}
              onChange={alterarRendimento(rendimento.chave, 'entidadeEmpregadora')}
              required
            />
            <TextField
              label={TEXTOS.meuCadastro.campoRendimentoMensal}
              type="number"
              value={rendimento.valor}
              onChange={alterarRendimento(rendimento.chave, 'valor')}
              required
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">{TEXTOS.geral.simboloMoeda}</InputAdornment>,
                },
                htmlInput: {
                  min: REGRAS_VALIDACAO.valorMinimoRendimento,
                  step: REGRAS_VALIDACAO.passoValorMonetario,
                },
              }}
            />
            <Button variant="outlined" color="error" onClick={() => removerRendimento(rendimento.chave)}>
              {TEXTOS.meuCadastro.botaoRemoverRendimento}
            </Button>
          </Box>
        ))}
      </SecaoFormulario>
      <Box sx={estilos.acoes}>
        <Box sx={estilos.grupoAcoes}>
          <Button type="submit" variant="contained" size="large" disabled={salvando}>
            {salvando ? TEXTOS.meuCadastro.salvando : TEXTOS.meuCadastro.botaoSalvar}
          </Button>
          <Button variant="outlined" size="large" onClick={descartar} disabled={salvando}>
            {TEXTOS.meuCadastro.botaoDescartar}
          </Button>
        </Box>
        <Button variant="outlined" color="error" size="large" onClick={() => setConfirmandoExclusao(true)}>
          {TEXTOS.meuCadastro.botaoExcluirConta}
        </Button>
      </Box>
      <DialogoConfirmacao
        aberto={confirmandoExclusao}
        titulo={TEXTOS.meuCadastro.tituloConfirmarExclusao}
        texto={TEXTOS.meuCadastro.textoConfirmarExclusao}
        rotuloCancelar={TEXTOS.meuCadastro.botaoCancelarExclusao}
        rotuloConfirmar={excluindo ? TEXTOS.meuCadastro.excluindo : TEXTOS.meuCadastro.botaoConfirmarExclusao}
        processando={excluindo}
        aoCancelar={() => setConfirmandoExclusao(false)}
        aoConfirmar={excluirConta}
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
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  linhaTripla: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
    gap: 2,
  },
  linhaRendimento: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr auto' },
    alignItems: 'center',
    gap: 2,
  },
  acoes: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 2,
  },
  grupoAcoes: {
    display: 'flex',
    gap: 2,
  },
} satisfies Record<string, SxProps<Theme>>

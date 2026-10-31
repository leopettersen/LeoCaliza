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
import { useState, type ChangeEvent, type SubmitEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LayoutAutenticacao } from '../../components/LayoutAutenticacao.tsx'
import { PERFIS, TIPOS_AGENTE } from '../../constants/perfis.ts'
import { PARAMETROS_URL, ROTAS } from '../../constants/rotas.ts'
import { TEXTOS } from '../../constants/textos.ts'
import { REGRAS_VALIDACAO } from '../../constants/validacao.ts'
import { useAutenticacao } from '../../hooks/useAutenticacao.ts'
import { obterRotaInicial } from '../../routes/rotaInicial.ts'
import { extrairMensagemDeErro } from '../../services/api.ts'
import { cadastrarUsuario } from '../../services/authService.ts'
import type { DadosCadastro, Perfil, TipoAgente } from '../../types/auth.ts'

const FORMULARIO_INICIAL = {
  nome: '',
  cpf: '',
  rg: '',
  endereco: '',
  profissao: '',
  login: '',
  senha: '',
  confirmarSenha: '',
}

type CampoFormulario = keyof typeof FORMULARIO_INICIAL

export function PaginaCadastro() {
  const { entrar } = useAutenticacao()
  const navegar = useNavigate()
  const [parametros, setParametros] = useSearchParams()
  const perfil: Perfil = parametros.get(PARAMETROS_URL.perfil) === PERFIS.agente ? PERFIS.agente : PERFIS.cliente
  const ehCliente = perfil === PERFIS.cliente
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL)
  const [tipoAgente, setTipoAgente] = useState<TipoAgente>(TIPOS_AGENTE.empresa)
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  function alterarCampo(campo: CampoFormulario) {
    return (evento: ChangeEvent<HTMLInputElement>) =>
      setFormulario((atual) => ({ ...atual, [campo]: evento.target.value }))
  }

  function alterarPerfil(novoPerfil: Perfil) {
    setParametros({ [PARAMETROS_URL.perfil]: novoPerfil }, { replace: true })
  }

  function montarDadosCadastro(): DadosCadastro {
    const { nome, cpf, rg, endereco, profissao, login, senha } = formulario
    const dadosComuns = { login, senha, perfil, nome }
    return ehCliente ? { ...dadosComuns, cpf, rg, endereco, profissao } : { ...dadosComuns, tipoAgente }
  }

  async function enviarCadastro(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault()
    setErro(null)
    if (formulario.senha !== formulario.confirmarSenha) {
      setErro(TEXTOS.cadastro.senhasDiferentes)
      return
    }
    setEnviando(true)
    try {
      await cadastrarUsuario(montarDadosCadastro())
      const sessao = await entrar({ login: formulario.login, senha: formulario.senha })
      navegar(obterRotaInicial(sessao.perfil), { replace: true })
    } catch (falha) {
      setErro(extrairMensagemDeErro(falha))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <LayoutAutenticacao>
      <Box component="form" onSubmit={enviarCadastro} sx={estilos.formulario}>
        <Box>
          <Typography variant="h4" component="h1">
            {TEXTOS.cadastro.titulo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {TEXTOS.cadastro.subtitulo}
          </Typography>
        </Box>
        {erro && <Alert severity="error">{erro}</Alert>}
        <FormControl>
          <FormLabel>{TEXTOS.cadastro.campoPerfil}</FormLabel>
          <RadioGroup row value={perfil} onChange={(evento) => alterarPerfil(evento.target.value as Perfil)}>
            <FormControlLabel value={PERFIS.cliente} control={<Radio />} label={TEXTOS.perfis.cliente} />
            <FormControlLabel value={PERFIS.agente} control={<Radio />} label={TEXTOS.perfis.agente} />
          </RadioGroup>
        </FormControl>

        <Typography variant="h6" component="h2">
          {TEXTOS.cadastro.secaoIdentificacao}
        </Typography>
        <TextField
          label={ehCliente ? TEXTOS.camposCliente.nome : TEXTOS.cadastro.campoNomeAgente}
          value={formulario.nome}
          onChange={alterarCampo('nome')}
          required
          fullWidth
        />
        {ehCliente ? (
          <>
            <Box sx={estilos.linhaDupla}>
              <TextField
                label={TEXTOS.camposCliente.cpf}
                placeholder={TEXTOS.camposCliente.exemploCpf}
                value={formulario.cpf}
                onChange={alterarCampo('cpf')}
                required
              />
              <TextField
                label={TEXTOS.camposCliente.rg}
                value={formulario.rg}
                onChange={alterarCampo('rg')}
                required
              />
            </Box>
            <TextField
              label={TEXTOS.camposCliente.endereco}
              value={formulario.endereco}
              onChange={alterarCampo('endereco')}
              required
              fullWidth
            />
            <TextField
              label={TEXTOS.camposCliente.profissao}
              value={formulario.profissao}
              onChange={alterarCampo('profissao')}
              required
              fullWidth
            />
          </>
        ) : (
          <FormControl>
            <FormLabel>{TEXTOS.cadastro.campoTipoAgente}</FormLabel>
            <RadioGroup
              row
              value={tipoAgente}
              onChange={(evento) => setTipoAgente(evento.target.value as TipoAgente)}
            >
              <FormControlLabel value={TIPOS_AGENTE.empresa} control={<Radio />} label={TEXTOS.tiposAgente.empresa} />
              <FormControlLabel value={TIPOS_AGENTE.banco} control={<Radio />} label={TEXTOS.tiposAgente.banco} />
            </RadioGroup>
          </FormControl>
        )}

        <Typography variant="h6" component="h2">
          {TEXTOS.cadastro.secaoAcesso}
        </Typography>
        <TextField
          label={TEXTOS.cadastro.campoUsuario}
          value={formulario.login}
          onChange={alterarCampo('login')}
          autoComplete="username"
          required
          fullWidth
        />
        <Box sx={estilos.linhaDupla}>
          <TextField
            label={TEXTOS.cadastro.campoSenha}
            type="password"
            value={formulario.senha}
            onChange={alterarCampo('senha')}
            helperText={TEXTOS.cadastro.ajudaSenha(REGRAS_VALIDACAO.tamanhoMinimoSenha)}
            slotProps={{ htmlInput: { minLength: REGRAS_VALIDACAO.tamanhoMinimoSenha } }}
            autoComplete="new-password"
            required
          />
          <TextField
            label={TEXTOS.cadastro.campoConfirmarSenha}
            type="password"
            value={formulario.confirmarSenha}
            onChange={alterarCampo('confirmarSenha')}
            autoComplete="new-password"
            required
          />
        </Box>
        <Button type="submit" variant="contained" size="large" disabled={enviando} fullWidth>
          {enviando ? TEXTOS.cadastro.criando : TEXTOS.cadastro.botaoCriar}
        </Button>
      </Box>
      <Divider sx={estilos.divisor} />
      <Box sx={estilos.rodape}>
        <Typography variant="body2" color="text.secondary">
          {TEXTOS.cadastro.jaTemCadastro}
        </Typography>
        <Button variant="text" onClick={() => navegar(ROTAS.login)}>
          {TEXTOS.cadastro.botaoEntrar}
        </Button>
      </Box>
    </LayoutAutenticacao>
  )
}

const estilos = {
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  linhaDupla: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
    gap: 2,
  },
  divisor: {
    my: 3,
  },
  rodape: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
} satisfies Record<string, SxProps<Theme>>

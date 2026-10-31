import {
  Alert,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutAutenticacao } from '../../components/LayoutAutenticacao.tsx'
import { PERFIS } from '../../constants/perfis.ts'
import { PARAMETROS_URL, ROTAS } from '../../constants/rotas.ts'
import { TEXTOS } from '../../constants/textos.ts'
import { useAutenticacao } from '../../hooks/useAutenticacao.ts'
import { obterRotaInicial } from '../../routes/rotaInicial.ts'
import { extrairMensagemDeErro } from '../../services/api.ts'
import type { Perfil } from '../../types/auth.ts'

export function PaginaLogin() {
  const { entrar } = useAutenticacao()
  const navegar = useNavigate()
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [perfilCadastro, setPerfilCadastro] = useState<Perfil>(PERFIS.cliente)

  async function enviarLogin(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      const sessao = await entrar({ login, senha })
      navegar(obterRotaInicial(sessao.perfil), { replace: true })
    } catch (falha) {
      setErro(extrairMensagemDeErro(falha))
    } finally {
      setEnviando(false)
    }
  }

  function irParaCadastro() {
    navegar({
      pathname: ROTAS.cadastro,
      search: new URLSearchParams({ [PARAMETROS_URL.perfil]: perfilCadastro }).toString(),
    })
  }

  return (
    <LayoutAutenticacao>
      <Box component="form" onSubmit={enviarLogin} sx={estilos.formulario}>
        <Box>
          <Typography variant="h4" component="h1">
            {TEXTOS.login.titulo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {TEXTOS.login.subtitulo}
          </Typography>
        </Box>
        {erro && <Alert severity="error">{erro}</Alert>}
        <TextField
          label={TEXTOS.login.campoUsuario}
          placeholder={TEXTOS.login.exemploUsuario}
          value={login}
          onChange={(evento) => setLogin(evento.target.value)}
          autoComplete="username"
          required
          fullWidth
        />
        <TextField
          label={TEXTOS.login.campoSenha}
          type="password"
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
          autoComplete="current-password"
          required
          fullWidth
        />
        <Button type="submit" variant="contained" size="large" disabled={enviando} fullWidth>
          {enviando ? TEXTOS.login.entrando : TEXTOS.login.botaoEntrar}
        </Button>
      </Box>
      <Divider sx={estilos.divisor} />
      <Box sx={estilos.primeiroAcesso}>
        <Typography variant="h6" component="h2">
          {TEXTOS.login.primeiroAcesso}
        </Typography>
        <RadioGroup
          row
          value={perfilCadastro}
          onChange={(evento) => setPerfilCadastro(evento.target.value as Perfil)}
        >
          <FormControlLabel value={PERFIS.cliente} control={<Radio />} label={TEXTOS.login.opcaoCliente} />
          <FormControlLabel value={PERFIS.agente} control={<Radio />} label={TEXTOS.login.opcaoAgente} />
        </RadioGroup>
        <Button variant="outlined" size="large" onClick={irParaCadastro} fullWidth>
          {TEXTOS.login.botaoCriarCadastro}
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
  divisor: {
    my: 3,
  },
  primeiroAcesso: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
} satisfies Record<string, SxProps<Theme>>

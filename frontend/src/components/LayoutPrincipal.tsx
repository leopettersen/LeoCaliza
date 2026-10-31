import { AppBar, Box, Button, Toolbar, Typography, type SxProps, type Theme } from '@mui/material'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LARGURAS } from '../constants/estilo.ts'
import { IMAGENS } from '../constants/imagens.ts'
import { MENUS } from '../constants/menus.ts'
import { PERFIS, TIPOS_AGENTE } from '../constants/perfis.ts'
import { ROTAS } from '../constants/rotas.ts'
import { TEXTOS } from '../constants/textos.ts'
import { useAutenticacao } from '../hooks/useAutenticacao.ts'
import type { Sessao } from '../types/auth.ts'

function descreverUsuario(sessao: Sessao) {
  const rotuloTipo =
    sessao.tipoAgente === TIPOS_AGENTE.banco ? TEXTOS.tiposAgente.banco : TEXTOS.tiposAgente.empresa
  const rotuloPerfil =
    sessao.perfil === PERFIS.agente ? TEXTOS.menu.perfilAgente(rotuloTipo) : TEXTOS.menu.perfilCliente
  return [sessao.nome, rotuloPerfil].join(TEXTOS.menu.separador)
}

export function LayoutPrincipal() {
  const { sessao, sair } = useAutenticacao()
  const navegar = useNavigate()

  if (!sessao) {
    return null
  }

  function encerrarSessao() {
    sair()
    navegar(ROTAS.login, { replace: true })
  }

  return (
    <Box sx={estilos.pagina}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={estilos.barra}>
        <Toolbar sx={estilos.toolbar}>
          <Box component="img" sx={estilos.logo} src={IMAGENS.logo} alt={TEXTOS.app.descricaoLogo} />
          <Box component="nav" sx={estilos.menu}>
            {MENUS[sessao.perfil].map((item) => (
              <Button key={item.rota} component={NavLink} to={item.rota} end sx={estilos.itemMenu}>
                {item.rotulo}
              </Button>
            ))}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={estilos.usuario}>
            {descreverUsuario(sessao)}
          </Typography>
          <Button variant="outlined" onClick={encerrarSessao} sx={estilos.sair}>
            {TEXTOS.menu.botaoSair}
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={estilos.conteudo}>
        <Outlet />
      </Box>
    </Box>
  )
}

const estilos = {
  pagina: {
    minHeight: '100vh',
    bgcolor: 'background.default',
  },
  barra: {
    borderBottom: 1,
    borderColor: 'divider',
  },
  toolbar: {
    columnGap: 3,
    rowGap: 1,
    flexWrap: 'wrap',
    py: { xs: 1, sm: 0 },
  },
  logo: {
    width: LARGURAS.logo,
    height: LARGURAS.logo,
    objectFit: 'cover',
    borderRadius: 1,
  },
  menu: {
    display: 'flex',
    gap: 1,
    flexGrow: 1,
    order: { xs: 3, sm: 0 },
    width: { xs: '100%', sm: 'auto' },
    overflowX: 'auto',
  },
  sair: {
    ml: { xs: 'auto', sm: 0 },
  },
  itemMenu: {
    flexShrink: 0,
    color: 'text.secondary',
    borderRadius: 0,
    borderBottom: 2,
    borderColor: 'transparent',
    '&.active': {
      color: 'primary.main',
      borderColor: 'success.main',
    },
  },
  usuario: {
    display: { xs: 'none', sm: 'block' },
  },
  conteudo: {
    maxWidth: LARGURAS.conteudo,
    mx: 'auto',
    px: 3,
    py: 4,
  },
} satisfies Record<string, SxProps<Theme>>

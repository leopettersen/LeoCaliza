import { CssBaseline, ThemeProvider } from '@mui/material'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { IMAGENS } from './constants/imagens.ts'
import { TEXTOS } from './constants/textos.ts'
import { ProvedorAutenticacao } from './context/AuthContext.tsx'
import { tema } from './styles/tema.ts'

function configurarDocumento() {
  document.title = TEXTOS.app.nome
  const favicon = document.createElement('link')
  favicon.rel = 'icon'
  favicon.href = IMAGENS.logo
  document.head.appendChild(favicon)
}

configurarDocumento()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={tema}>
      <CssBaseline />
      <ProvedorAutenticacao>
        <App />
      </ProvedorAutenticacao>
    </ThemeProvider>
  </StrictMode>,
)

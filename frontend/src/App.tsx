import { IMAGENS } from './constants/imagens.ts'
import { TEXTOS } from './constants/textos.ts'
import estilos from './App.module.css'

function App() {
  return (
    <main className={estilos.inicio}>
      <img className={estilos.logo} src={IMAGENS.logo} alt={TEXTOS.app.descricaoLogo} />
      <h1>{TEXTOS.app.nome}</h1>
    </main>
  )
}

export default App

import { CORES } from '../constants/cores.ts'
import { ESPACOS, FONTES, LARGURAS, RAIOS, SOMBRAS, TAMANHOS_FONTE } from '../constants/estilo.ts'

const GRUPOS_DO_TEMA: Record<string, Record<string, string>> = {
  cor: CORES,
  fonte: FONTES,
  'tamanho-fonte': TAMANHOS_FONTE,
  espaco: ESPACOS,
  raio: RAIOS,
  sombra: SOMBRAS,
  largura: LARGURAS,
}

function paraKebabCase(nome: string) {
  return nome.replace(/[A-Z]/g, (letra) => `-${letra.toLowerCase()}`)
}

export function aplicarTema(raiz: HTMLElement = document.documentElement) {
  Object.entries(GRUPOS_DO_TEMA).forEach(([prefixo, valores]) => {
    Object.entries(valores).forEach(([nome, valor]) => {
      raiz.style.setProperty(`--${prefixo}-${paraKebabCase(nome)}`, valor)
    })
  })
}

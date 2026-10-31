import { CHAVES_ARMAZENAMENTO } from '../constants/armazenamento.ts'
import type { Sessao } from '../types/auth.ts'

export function lerSessaoSalva(): Sessao | null {
  try {
    const salva = localStorage.getItem(CHAVES_ARMAZENAMENTO.sessao)
    return salva ? (JSON.parse(salva) as Sessao) : null
  } catch {
    return null
  }
}

export function salvarSessao(sessao: Sessao) {
  try {
    localStorage.setItem(CHAVES_ARMAZENAMENTO.sessao, JSON.stringify(sessao))
  } catch {
    return
  }
}

export function apagarSessao() {
  try {
    localStorage.removeItem(CHAVES_ARMAZENAMENTO.sessao)
  } catch {
    return
  }
}

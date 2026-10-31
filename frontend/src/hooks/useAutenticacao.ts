import { useContext } from 'react'
import { ContextoAutenticacao } from '../context/ContextoAutenticacao.ts'
import { TEXTOS } from '../constants/textos.ts'

export function useAutenticacao() {
  const contexto = useContext(ContextoAutenticacao)
  if (!contexto) {
    throw new Error(TEXTOS.erros.provedorAutenticacaoAusente)
  }
  return contexto
}

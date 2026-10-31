import { useMemo } from 'react'
import { TIPOS_AGENTE } from '../constants/perfis.ts'
import { listarAgentes } from '../services/agenteService.ts'
import { useRequisicao } from './useRequisicao.ts'

export function useAgentes() {
  const { dados, carregando, erro } = useRequisicao(listarAgentes)
  return useMemo(() => {
    const agentes = dados ?? []
    return {
      empresas: agentes.filter((agente) => agente.tipo === TIPOS_AGENTE.empresa),
      bancos: agentes.filter((agente) => agente.tipo === TIPOS_AGENTE.banco),
      carregando,
      erro,
    }
  }, [dados, carregando, erro])
}

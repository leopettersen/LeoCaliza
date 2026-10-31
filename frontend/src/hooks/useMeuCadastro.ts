import { consultarMeuCadastro } from '../services/clienteService.ts'
import { useRequisicao } from './useRequisicao.ts'

export function useMeuCadastro() {
  const { dados, carregando, erro, recarregar } = useRequisicao(consultarMeuCadastro)
  return { cliente: dados, carregando, erro, recarregar }
}

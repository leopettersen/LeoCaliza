import { listarClientesProprietarios } from '@/services/clienteService.ts';
import { useRequisicao } from '@/hooks/useRequisicao.ts';

export function useClientesProprietarios() {
  const { dados, erro } = useRequisicao(listarClientesProprietarios);
  return { clientes: dados ?? [], erro };
}

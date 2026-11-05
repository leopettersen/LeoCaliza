import { TIPOS_AGENTE } from '@/constants/perfis.ts';
import { STATUS_PEDIDO } from '@/constants/status.ts';
import { TEXTOS } from '@/constants/textos.ts';
import type { Sessao } from '@/types/auth.ts';
import type { Pedido } from '@/types/pedido.ts';

export function podeModificar(pedido: Pedido) {
  return pedido.status === STATUS_PEDIDO.emAnalise;
}

export function podeAvaliar(pedido: Pedido, sessao?: Sessao | null) {
  if (pedido.status !== STATUS_PEDIDO.emAnalise) {
    return false;
  }
  if (sessao) {
    if (pedido.automovel?.tipoProprietario === 'CLIENTE' && pedido.automovel?.proprietarioId === sessao.id) {
      return true;
    }
    if (pedido.cliente?.id === sessao.id && pedido.automovel?.proprietarioId === sessao.id) {
      return true;
    }
  }
  return true;
}

export function podeCancelar(pedido: Pedido) {
  return pedido.status !== STATUS_PEDIDO.contratoExecutado && pedido.status !== STATUS_PEDIDO.cancelado;
}

export function podeConcederCredito(pedido: Pedido, sessao: Sessao | null) {
  const antesDaExecucao = pedido.status === STATUS_PEDIDO.emAnalise || pedido.status === STATUS_PEDIDO.aprovado;
  return (
    sessao?.tipoAgente === TIPOS_AGENTE.banco &&
    pedido.bancoCreditoId === sessao.id &&
    pedido.contratoCredito === null &&
    antesDaExecucao
  );
}

export function aguardaConcessaoDeCredito(pedido: Pedido) {
  return pedido.bancoCreditoId !== null && pedido.contratoCredito === null;
}

export function obterBloqueioExecucao(pedido: Pedido) {
  if (pedido.status === STATUS_PEDIDO.contratoExecutado) {
    return TEXTOS.acoesContrato.contratoJaExecutado;
  }
  if (pedido.status !== STATUS_PEDIDO.aprovado) {
    return TEXTOS.acoesContrato.apenasAprovados;
  }
  if (aguardaConcessaoDeCredito(pedido)) {
    return TEXTOS.acoesContrato.aguardandoCredito;
  }
  return null;
}

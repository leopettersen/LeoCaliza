import type { ItemDado } from '../components/ListaDados.tsx'
import { ROTULOS_TIPO_PROPRIETARIO } from '../constants/rotulos.ts'
import { TEXTOS } from '../constants/textos.ts'
import type { Pedido } from '../types/pedido.ts'
import { descreverAutomovel, formatarData, formatarDataHora, formatarMoeda, formatarPeriodo } from './formatacao.ts'

export function descreverCredito(pedido: Pedido) {
  if (pedido.contratoCredito) {
    const { agenteNome, valor, prazoMeses } = pedido.contratoCredito
    return TEXTOS.detalhePedido.creditoConcedido(agenteNome, formatarMoeda(valor), prazoMeses)
  }
  if (pedido.bancoCreditoNome) {
    return TEXTOS.detalhePedido.creditoSolicitado(pedido.bancoCreditoNome)
  }
  return TEXTOS.detalhePedido.semCredito
}

export function montarDadosPedido(pedido: Pedido): ItemDado[] {
  const { automovel, avaliacao, contratoAluguel } = pedido
  const itens: ItemDado[] = [
    { rotulo: TEXTOS.detalhePedido.rotuloAutomovel, valor: descreverAutomovel(automovel) },
    { rotulo: TEXTOS.detalhePedido.rotuloAno, valor: String(automovel.ano) },
    { rotulo: TEXTOS.detalhePedido.rotuloMatricula, valor: automovel.matricula },
    { rotulo: TEXTOS.detalhePedido.rotuloPeriodo, valor: formatarPeriodo(pedido.dataRetirada, pedido.dataDevolucao) },
    {
      rotulo: TEXTOS.detalhePedido.rotuloProprietario,
      valor: TEXTOS.formularioPedido.descricaoProprietario(
        ROTULOS_TIPO_PROPRIETARIO[automovel.tipoProprietario],
        automovel.proprietarioNome,
      ),
    },
    { rotulo: TEXTOS.detalhePedido.rotuloCredito, valor: descreverCredito(pedido) },
    { rotulo: TEXTOS.detalhePedido.rotuloDataPedido, valor: formatarData(pedido.dataCriacao) },
  ]
  if (avaliacao) {
    itens.push({
      rotulo: TEXTOS.detalhePedido.rotuloParecer,
      valor: TEXTOS.detalhePedido.descricaoParecer(
        avaliacao.resultado ? TEXTOS.detalhePedido.parecerPositivo : TEXTOS.detalhePedido.parecerNegativo,
        avaliacao.agenteNome,
        formatarDataHora(avaliacao.data),
        avaliacao.observacao,
      ),
    })
  }
  if (contratoAluguel) {
    itens.push({
      rotulo: TEXTOS.detalhePedido.rotuloContrato,
      valor: TEXTOS.detalhePedido.contratoExecutadoEm(formatarDataHora(contratoAluguel.dataExecucao)),
    })
  }
  if (pedido.modificadoPor && pedido.dataModificacao) {
    itens.push({
      rotulo: TEXTOS.detalhePedido.rotuloUltimaModificacao,
      valor: TEXTOS.detalhePedido.descricaoModificacao(pedido.modificadoPor, formatarDataHora(pedido.dataModificacao)),
    })
  }
  return itens
}

package com.example.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.backend.model.Agente;
import com.example.backend.model.PedidoAluguel;
import com.example.backend.model.enums.StatusPedido;

public record PedidoResponse(
        Long id,
        ClienteResponse cliente,
        BigDecimal rendaTotal,
        AutomovelResponse automovel,
        Long bancoCreditoId,
        String bancoCreditoNome,
        LocalDate dataCriacao,
        LocalDate dataRetirada,
        LocalDate dataDevolucao,
        StatusPedido status,
        AvaliacaoResponse avaliacao,
        ContratoCreditoResponse contratoCredito,
        ContratoAluguelResponse contratoAluguel,
        String modificadoPor,
        LocalDateTime dataModificacao) {

    public static PedidoResponse from(PedidoAluguel pedido) {
        Agente banco = pedido.getBancoCredito();
        return new PedidoResponse(
                pedido.getId(),
                ClienteResponse.from(pedido.getCliente()),
                pedido.getCliente().calcularRendaTotal(),
                AutomovelResponse.from(pedido.getAutomovel()),
                banco == null ? null : banco.getId(),
                banco == null ? null : banco.getNome(),
                pedido.getDataCriacao(),
                pedido.getDataRetirada(),
                pedido.getDataDevolucao(),
                pedido.getStatus(),
                pedido.getAvaliacao() == null ? null : AvaliacaoResponse.from(pedido.getAvaliacao()),
                pedido.getContratoCredito() == null ? null : ContratoCreditoResponse.from(pedido.getContratoCredito()),
                pedido.getContratoAluguel() == null ? null : ContratoAluguelResponse.from(pedido.getContratoAluguel()),
                pedido.getModificadoPor() == null ? null : pedido.getModificadoPor().getLogin(),
                pedido.getDataModificacao());
    }
}

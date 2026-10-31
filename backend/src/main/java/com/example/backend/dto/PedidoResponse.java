package com.example.backend.dto;

import java.time.LocalDate;

import com.example.backend.model.Agente;
import com.example.backend.model.PedidoAluguel;
import com.example.backend.model.enums.StatusPedido;

public record PedidoResponse(
        Long id,
        Long clienteId,
        String clienteNome,
        AutomovelResponse automovel,
        Long bancoCreditoId,
        String bancoCreditoNome,
        LocalDate dataCriacao,
        LocalDate dataRetirada,
        LocalDate dataDevolucao,
        StatusPedido status) {

    public static PedidoResponse from(PedidoAluguel pedido) {
        Agente banco = pedido.getBancoCredito();
        return new PedidoResponse(
                pedido.getId(),
                pedido.getCliente().getId(),
                pedido.getCliente().getNome(),
                AutomovelResponse.from(pedido.getAutomovel()),
                banco == null ? null : banco.getId(),
                banco == null ? null : banco.getNome(),
                pedido.getDataCriacao(),
                pedido.getDataRetirada(),
                pedido.getDataDevolucao(),
                pedido.getStatus());
    }
}

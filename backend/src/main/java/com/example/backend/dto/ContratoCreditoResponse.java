package com.example.backend.dto;

import java.math.BigDecimal;

import com.example.backend.model.ContratoCredito;

public record ContratoCreditoResponse(
        Long id,
        BigDecimal valor,
        Integer prazoMeses,
        Long agenteId,
        String agenteNome) {

    public static ContratoCreditoResponse from(ContratoCredito contrato) {
        return new ContratoCreditoResponse(
                contrato.getId(),
                contrato.getValor(),
                contrato.getPrazoMeses(),
                contrato.getAgente().getId(),
                contrato.getAgente().getNome());
    }
}

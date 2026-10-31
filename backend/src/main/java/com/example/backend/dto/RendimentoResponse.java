package com.example.backend.dto;

import java.math.BigDecimal;

import com.example.backend.model.Rendimento;

public record RendimentoResponse(Long id, String entidadeEmpregadora, BigDecimal valor) {

    public static RendimentoResponse from(Rendimento rendimento) {
        return new RendimentoResponse(
                rendimento.getId(),
                rendimento.getEntidadeEmpregadora(),
                rendimento.getValor());
    }
}

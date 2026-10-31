package com.example.backend.dto;

import java.time.LocalDateTime;

import com.example.backend.model.AvaliacaoFinanceira;

public record AvaliacaoResponse(
        Long id,
        Boolean resultado,
        String observacao,
        LocalDateTime data,
        Long agenteId,
        String agenteNome) {

    public static AvaliacaoResponse from(AvaliacaoFinanceira avaliacao) {
        return new AvaliacaoResponse(
                avaliacao.getId(),
                avaliacao.getResultado(),
                avaliacao.getObservacao(),
                avaliacao.getData(),
                avaliacao.getAgente().getId(),
                avaliacao.getAgente().getNome());
    }
}

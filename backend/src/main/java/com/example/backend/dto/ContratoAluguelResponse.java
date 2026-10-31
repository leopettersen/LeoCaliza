package com.example.backend.dto;

import java.time.LocalDateTime;

import com.example.backend.model.ContratoAluguel;

public record ContratoAluguelResponse(Long id, LocalDateTime dataExecucao) {

    public static ContratoAluguelResponse from(ContratoAluguel contrato) {
        return new ContratoAluguelResponse(contrato.getId(), contrato.getDataExecucao());
    }
}

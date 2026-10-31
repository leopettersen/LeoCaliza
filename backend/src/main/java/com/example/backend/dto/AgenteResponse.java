package com.example.backend.dto;

import com.example.backend.model.Agente;
import com.example.backend.model.enums.TipoAgente;

public record AgenteResponse(Long id, String nome, TipoAgente tipo) {

    public static AgenteResponse from(Agente agente) {
        return new AgenteResponse(agente.getId(), agente.getNome(), agente.getTipo());
    }
}

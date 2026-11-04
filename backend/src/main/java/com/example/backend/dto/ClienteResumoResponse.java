package com.example.backend.dto;

import com.example.backend.model.Cliente;

public record ClienteResumoResponse(Long id, String nome) {

    public static ClienteResumoResponse from(Cliente cliente) {
        return new ClienteResumoResponse(cliente.getId(), cliente.getNome());
    }
}
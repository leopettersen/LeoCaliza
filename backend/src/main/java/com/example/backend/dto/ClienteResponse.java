package com.example.backend.dto;

import java.util.List;

import com.example.backend.model.Cliente;

public record ClienteResponse(
        Long id,
        String login,
        String nome,
        String rg,
        String cpf,
        String endereco,
        String profissao,
        List<RendimentoResponse> rendimentos) {

    public static ClienteResponse from(Cliente cliente) {
        return new ClienteResponse(
                cliente.getId(),
                cliente.getLogin(),
                cliente.getNome(),
                cliente.getRg(),
                cliente.getCpf(),
                cliente.getEndereco(),
                cliente.getProfissao(),
                cliente.getRendimentos().stream().map(RendimentoResponse::from).toList());
    }
}

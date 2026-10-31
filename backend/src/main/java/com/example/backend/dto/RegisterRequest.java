package com.example.backend.dto;

import java.util.List;

import com.example.backend.model.enums.Perfil;
import com.example.backend.model.enums.TipoAgente;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String login,
        @NotBlank @Size(min = 6) String senha,
        @NotNull Perfil perfil,
        @NotBlank String nome,
        String rg,
        String cpf,
        String endereco,
        String profissao,
        @Valid @Size(max = 3) List<RendimentoRequest> rendimentos,
        TipoAgente tipoAgente) {
}
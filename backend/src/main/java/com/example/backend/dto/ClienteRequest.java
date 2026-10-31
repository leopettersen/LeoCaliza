package com.example.backend.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ClienteRequest(
        @NotBlank String nome,
        @NotBlank @Size(max = 20) String rg,
        @NotBlank @Pattern(regexp = "\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}", message = "CPF inválido") String cpf,
        @NotBlank String endereco,
        @NotBlank String profissao,
        @Valid @Size(max = 3, message = "Um cliente pode ter no máximo 3 rendimentos") List<RendimentoRequest> rendimentos) {
}

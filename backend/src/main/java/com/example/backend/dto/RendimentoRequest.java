package com.example.backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record RendimentoRequest(
        @NotBlank String entidadeEmpregadora,
        @NotNull @Positive BigDecimal valor) {
}
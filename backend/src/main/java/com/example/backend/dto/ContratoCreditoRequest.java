package com.example.backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ContratoCreditoRequest(
        @NotNull @Positive @Digits(integer = 10, fraction = 2) BigDecimal valor,
        @NotNull @Min(1) Integer prazoMeses) {
}

package com.example.backend.dto;

import java.time.LocalDate;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

public record PedidoRequest(
        @NotNull @Valid AutomovelRequest automovel,
        @NotNull TipoProprietario tipoProprietario,
        Long proprietarioId,
        @NotNull @FutureOrPresent LocalDate dataRetirada,
        @NotNull @FutureOrPresent LocalDate dataDevolucao) {
}

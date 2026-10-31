package com.example.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AutomovelRequest(
        @NotBlank @Size(max = 30) String matricula,
        @NotNull @Min(1900) @Max(2100) Integer ano,
        @NotBlank @Size(max = 60) String marca,
        @NotBlank @Size(max = 60) String modelo,
        @NotBlank @Size(max = 10) String placa) {
}

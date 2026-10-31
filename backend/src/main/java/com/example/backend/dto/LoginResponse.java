package com.example.backend.dto;

import com.example.backend.model.enums.Perfil;
import com.example.backend.model.enums.TipoAgente;

public record LoginResponse(String token, String tipo, Long id, Perfil perfil, String nome, TipoAgente tipoAgente) {
}

package com.example.backend.dto;

import com.example.backend.model.enums.Perfil;

public record LoginResponse(String token, String tipo, Perfil perfil) {
}
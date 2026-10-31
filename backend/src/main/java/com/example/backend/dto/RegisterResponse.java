package com.example.backend.dto;

import com.example.backend.model.enums.Perfil;

public record RegisterResponse(Long id, String login, Perfil perfil) {
}
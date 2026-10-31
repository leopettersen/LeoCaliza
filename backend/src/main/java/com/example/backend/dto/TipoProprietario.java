package com.example.backend.dto;

import org.hibernate.Hibernate;

import com.example.backend.model.Agente;
import com.example.backend.model.Usuario;
import com.example.backend.model.enums.TipoAgente;

public enum TipoProprietario {
    CLIENTE,
    EMPRESA,
    BANCO;

    public static TipoProprietario de(Usuario usuario) {
        if (Hibernate.unproxy(usuario) instanceof Agente agente) {
            return agente.getTipo() == TipoAgente.BANCO ? BANCO : EMPRESA;
        }
        return CLIENTE;
    }
}

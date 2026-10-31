package com.example.backend.dto;

import org.hibernate.Hibernate;

import com.example.backend.model.Agente;
import com.example.backend.model.Automovel;
import com.example.backend.model.Cliente;
import com.example.backend.model.Usuario;

public record AutomovelResponse(
        Long id,
        String matricula,
        Integer ano,
        String marca,
        String modelo,
        String placa,
        Long proprietarioId,
        String proprietarioNome,
        TipoProprietario tipoProprietario) {

    public static AutomovelResponse from(Automovel automovel) {
        Usuario proprietario = (Usuario) Hibernate.unproxy(automovel.getProprietario());
        String nomeProprietario = switch (proprietario) {
            case Cliente cliente -> cliente.getNome();
            case Agente agente -> agente.getNome();
            default -> proprietario.getLogin();
        };
        return new AutomovelResponse(
                automovel.getId(),
                automovel.getMatricula(),
                automovel.getAno(),
                automovel.getMarca(),
                automovel.getModelo(),
                automovel.getPlaca(),
                proprietario.getId(),
                nomeProprietario,
                TipoProprietario.de(proprietario));
    }
}

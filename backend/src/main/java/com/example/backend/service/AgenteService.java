package com.example.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.AgenteResponse;
import com.example.backend.model.Agente;
import com.example.backend.model.enums.TipoAgente;
import com.example.backend.repository.AgenteRepository;

@Service
public class AgenteService {

    private final AgenteRepository agenteRepository;

    public AgenteService(AgenteRepository agenteRepository) {
        this.agenteRepository = agenteRepository;
    }

    @Transactional(readOnly = true)
    public List<AgenteResponse> listar(TipoAgente tipo) {
        List<Agente> agentes = tipo == null
                ? agenteRepository.findAll()
                : agenteRepository.findByTipo(tipo);
        return agentes.stream().map(AgenteResponse::from).toList();
    }
}

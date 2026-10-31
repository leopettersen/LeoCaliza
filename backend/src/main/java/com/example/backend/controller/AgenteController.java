package com.example.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.AgenteResponse;
import com.example.backend.model.enums.TipoAgente;
import com.example.backend.service.AgenteService;

@RestController
@RequestMapping("/agentes")
public class AgenteController {

    private final AgenteService agenteService;

    public AgenteController(AgenteService agenteService) {
        this.agenteService = agenteService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CLIENTE', 'AGENTE')")
    public ResponseEntity<List<AgenteResponse>> listar(@RequestParam(required = false) TipoAgente tipo) {
        return ResponseEntity.ok(agenteService.listar(tipo));
    }
}

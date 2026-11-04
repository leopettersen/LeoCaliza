package com.example.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ClienteResumoResponse;
import com.example.backend.service.ClienteService;

@RestController
@RequestMapping("/clientes/proprietarios")
@PreAuthorize("hasAnyRole('CLIENTE', 'AGENTE')")
public class ProprietarioController {

    private final ClienteService clienteService;

    public ProprietarioController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public ResponseEntity<List<ClienteResumoResponse>> listar() {
        return ResponseEntity.ok(clienteService.listarResumo());
    }
}
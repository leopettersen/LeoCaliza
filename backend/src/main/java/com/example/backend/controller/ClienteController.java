package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ClienteRequest;
import com.example.backend.dto.ClienteResponse;
import com.example.backend.service.ClienteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/clientes/me")
@PreAuthorize("hasRole('CLIENTE')")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public ResponseEntity<ClienteResponse> consultar(Authentication authentication) {
        return ResponseEntity.ok(clienteService.consultar(authentication.getName()));
    }

    @PutMapping
    public ResponseEntity<ClienteResponse> atualizar(@Valid @RequestBody ClienteRequest request,
                                                     Authentication authentication) {
        return ResponseEntity.ok(clienteService.atualizar(authentication.getName(), request));
    }

    @DeleteMapping
    public ResponseEntity<Void> excluir(Authentication authentication) {
        clienteService.excluir(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}

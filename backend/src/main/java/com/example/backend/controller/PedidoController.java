package com.example.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.PedidoRequest;
import com.example.backend.dto.PedidoResponse;
import com.example.backend.model.enums.StatusPedido;
import com.example.backend.service.PedidoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<PedidoResponse> criar(@Valid @RequestBody PedidoRequest request,
                                                Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pedidoService.criar(authentication.getName(), request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CLIENTE', 'AGENTE')")
    public ResponseEntity<List<PedidoResponse>> listar(@RequestParam(required = false) StatusPedido status,
                                                       Authentication authentication) {
        return ResponseEntity.ok(pedidoService.listar(authentication.getName(), status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENTE', 'AGENTE')")
    public ResponseEntity<PedidoResponse> buscar(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(pedidoService.buscar(authentication.getName(), id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<PedidoResponse> modificar(@PathVariable Long id,
                                                    @Valid @RequestBody PedidoRequest request,
                                                    Authentication authentication) {
        return ResponseEntity.ok(pedidoService.modificar(authentication.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<Void> cancelar(@PathVariable Long id, Authentication authentication) {
        pedidoService.cancelar(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
package com.example.backend.repository;

import com.example.backend.model.PedidoAluguel;
import com.example.backend.model.enums.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoAluguelRepository extends JpaRepository<PedidoAluguel, Long> {

    List<PedidoAluguel> findByClienteId(Long clienteId);

    List<PedidoAluguel> findByClienteLogin(String login);

    List<PedidoAluguel> findByClienteLoginAndStatus(String login, StatusPedido status);

    List<PedidoAluguel> findByStatus(StatusPedido status);

    boolean existsByClienteId(Long clienteId);
}
package com.example.backend.repository;

import com.example.backend.model.ContratoCredito;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContratoCreditoRepository extends JpaRepository<ContratoCredito, Long> {
}
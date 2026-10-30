package com.example.backend.repository;

import com.example.backend.model.AvaliacaoFinanceira;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvaliacaoFinanceiraRepository extends JpaRepository<AvaliacaoFinanceira, Long> {
}
package com.example.backend.repository;

import com.example.backend.model.Rendimento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RendimentoRepository extends JpaRepository<Rendimento, Long> {
}
package com.example.backend.repository;

import com.example.backend.model.Automovel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AutomovelRepository extends JpaRepository<Automovel, Long> {

    Optional<Automovel> findByPlaca(String placa);

    boolean existsByPlaca(String placa);

    boolean existsByMatricula(String matricula);
}
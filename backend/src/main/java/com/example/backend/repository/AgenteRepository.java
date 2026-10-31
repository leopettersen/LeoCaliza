package com.example.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.Agente;
import com.example.backend.model.enums.TipoAgente;

public interface AgenteRepository extends JpaRepository<Agente, Long> {

  List<Agente> findByTipo(TipoAgente tipo);

  Optional<Agente> findByLogin(String login);
}

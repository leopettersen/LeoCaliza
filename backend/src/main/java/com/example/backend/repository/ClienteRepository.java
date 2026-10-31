package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.example.backend.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

  boolean existsByCpf(String cpf);
  Optional<Cliente> findByLogin(String login);
}

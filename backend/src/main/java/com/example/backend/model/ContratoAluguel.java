package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "contrato_aluguel")
@Getter
@Setter
@NoArgsConstructor
public class ContratoAluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @Column(name = "data_execucao", nullable = false)
    private LocalDateTime dataExecucao;

    @PrePersist
    void definirDataExecucao() {
        if (dataExecucao == null) {
            dataExecucao = LocalDateTime.now();
        }
    }
}
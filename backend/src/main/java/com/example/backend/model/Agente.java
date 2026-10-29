package com.example.backend.model;

import com.example.backend.model.enums.TipoAgente;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "agente")
@Getter
@Setter
@NoArgsConstructor
public class Agente extends Usuario {

  @Column(nullable = false)
  private String nome;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TipoAgente tipo;

  public boolean isBanco() {
    return tipo == TipoAgente.BANCO;
  }

}

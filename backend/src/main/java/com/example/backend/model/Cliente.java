package com.example.backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@NoArgsConstructor
public class Cliente extends Usuario {

  @Column(nullable = false)
  private String nome;

  @Column(nullable = false, length = 20)
  private String rg;

  @Column(nullable = false, unique = true, length = 14)
  private String cpf;

  @Column(nullable = false)
  private String endereco;

  @Column(nullable = false)
  private String profissao;

  @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Rendimento> rendimentos = new ArrayList<>();

  public void adicionarRendimento(Rendimento rendimento) {
      rendimento.setCliente(this);
      rendimentos.add(rendimento);
  }

  public void removerRendimento(Rendimento rendimento) {
      rendimentos.remove(rendimento);
      rendimento.setCliente(null);
  }
}

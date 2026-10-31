package com.example.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.RegisterResponse;
import com.example.backend.dto.RendimentoRequest;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.model.Agente;
import com.example.backend.model.Cliente;
import com.example.backend.model.enums.Perfil;
import com.example.backend.model.Rendimento;
import com.example.backend.model.Usuario;
import com.example.backend.repository.AgenteRepository;
import com.example.backend.repository.ClienteRepository;
import com.example.backend.repository.UsuarioRepository;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository,
                       ClienteRepository clienteRepository,
                       AgenteRepository agenteRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
        this.agenteRepository = agenteRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByLogin(request.login())
                .filter(u -> passwordEncoder.matches(request.senha(), u.getSenhaHash()))
                .orElseThrow(() -> new UnauthorizedException("Login ou senha inválidos"));
        return new LoginResponse(jwtService.gerarToken(usuario), "Bearer", usuario.getPerfil());
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByLogin(request.login())) {
            throw new ConflictException("Login já cadastrado");
        }
        Usuario salvo = switch (request.perfil()) {
            case CLIENTE -> registrarCliente(request);
            case AGENTE -> registrarAgente(request);
        };
        return new RegisterResponse(salvo.getId(), salvo.getLogin(), salvo.getPerfil());
    }

    private Cliente registrarCliente(RegisterRequest request) {
      if (isBlank(request.rg()) || isBlank(request.cpf())
              || isBlank(request.endereco()) || isBlank(request.profissao())) {
          throw new BadRequestException("Cliente exige RG, CPF, endereço e profissão");
      }
      if (request.rendimentos() != null && request.rendimentos().size() > 3) {
          throw new BadRequestException("Um cliente pode ter no máximo 3 rendimentos");
      }
      Cliente cliente = new Cliente();
      cliente.setLogin(request.login());
      cliente.setSenhaHash(passwordEncoder.encode(request.senha()));
      cliente.setPerfil(Perfil.CLIENTE);
      cliente.setNome(request.nome());
      cliente.setRg(request.rg());
      cliente.setCpf(request.cpf());
      cliente.setEndereco(request.endereco());
      cliente.setProfissao(request.profissao());

      List<Rendimento> rendimentos = new ArrayList<>();
      if (request.rendimentos() != null) {
          for (RendimentoRequest r : request.rendimentos()) {
              Rendimento rendimento = new Rendimento();
              rendimento.setEntidadeEmpregadora(r.entidadeEmpregadora());
              rendimento.setValor(r.valor());
              rendimento.setCliente(cliente);
              rendimentos.add(rendimento);
          }
      }
      cliente.setRendimentos(rendimentos);
      return clienteRepository.save(cliente);
    }

    private Agente registrarAgente(RegisterRequest request) {
        if (request.tipoAgente() == null) {
            throw new BadRequestException("Agente exige tipo (Banco ou Empresa)");
        }
        Agente agente = new Agente();
        agente.setLogin(request.login());
        agente.setSenhaHash(passwordEncoder.encode(request.senha()));
        agente.setPerfil(Perfil.AGENTE);
        agente.setNome(request.nome());
        agente.setTipo(request.tipoAgente());
        return agenteRepository.save(agente);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
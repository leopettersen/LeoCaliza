package com.example.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.RegisterResponse;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.model.Agente;
import com.example.backend.model.enums.Perfil;
import com.example.backend.model.Usuario;
import com.example.backend.repository.AgenteRepository;
import com.example.backend.repository.UsuarioRepository;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final AgenteRepository agenteRepository;
    private final ClienteService clienteService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository,
                       AgenteRepository agenteRepository,
                       ClienteService clienteService,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.agenteRepository = agenteRepository;
        this.clienteService = clienteService;
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
            case CLIENTE -> clienteService.criar(request);
            case AGENTE -> registrarAgente(request);
        };
        return new RegisterResponse(salvo.getId(), salvo.getLogin(), salvo.getPerfil());
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
}

package com.example.backend.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.ClienteRequest;
import com.example.backend.dto.ClienteResponse;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.RendimentoRequest;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.NotFoundException;
import com.example.backend.model.Cliente;
import com.example.backend.model.Rendimento;
import com.example.backend.model.enums.Perfil;
import com.example.backend.repository.ClienteRepository;
import com.example.backend.repository.PedidoAluguelRepository;

@Service
public class ClienteService {

    private static final int MAX_RENDIMENTOS = 3;

    private final ClienteRepository clienteRepository;
    private final PedidoAluguelRepository pedidoRepository;
    private final PasswordEncoder passwordEncoder;

    public ClienteService(ClienteRepository clienteRepository,
                          PedidoAluguelRepository pedidoRepository,
                          PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.pedidoRepository = pedidoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Cliente criar(RegisterRequest request) {
        if (isBlank(request.rg()) || isBlank(request.cpf())
                || isBlank(request.endereco()) || isBlank(request.profissao())) {
            throw new BadRequestException("Cliente exige RG, CPF, endereço e profissão");
        }
        if (clienteRepository.existsByCpf(request.cpf())) {
            throw new ConflictException("CPF já cadastrado");
        }
        Cliente cliente = new Cliente();
        cliente.setLogin(request.login());
        cliente.setSenhaHash(passwordEncoder.encode(request.senha()));
        cliente.setPerfil(Perfil.CLIENTE);
        aplicarDados(cliente, new ClienteRequest(request.nome(), request.rg(), request.cpf(),
                request.endereco(), request.profissao(), request.rendimentos()));
        return clienteRepository.save(cliente);
    }

    @Transactional(readOnly = true)
    public ClienteResponse consultar(String login) {
        return ClienteResponse.from(buscarCliente(login));
    }

    @Transactional
    public ClienteResponse atualizar(String login, ClienteRequest request) {
        Cliente cliente = buscarCliente(login);
        if (!cliente.getCpf().equals(request.cpf()) && clienteRepository.existsByCpf(request.cpf())) {
            throw new ConflictException("CPF já cadastrado");
        }
        aplicarDados(cliente, request);
        return ClienteResponse.from(clienteRepository.save(cliente));
    }

    @Transactional
    public void excluir(String login) {
        Cliente cliente = buscarCliente(login);
        if (pedidoRepository.existsByClienteId(cliente.getId())) {
            throw new ConflictException("Cliente com pedidos registrados não pode ser excluído");
        }
        clienteRepository.delete(cliente);
    }

    private void aplicarDados(Cliente cliente, ClienteRequest dados) {
        List<RendimentoRequest> rendimentos = dados.rendimentos() == null ? List.of() : dados.rendimentos();
        if (rendimentos.size() > MAX_RENDIMENTOS) {
            throw new BadRequestException("Um cliente pode ter no máximo 3 rendimentos");
        }
        cliente.setNome(dados.nome());
        cliente.setRg(dados.rg());
        cliente.setCpf(dados.cpf());
        cliente.setEndereco(dados.endereco());
        cliente.setProfissao(dados.profissao());
        cliente.getRendimentos().clear();
        for (RendimentoRequest r : rendimentos) {
            Rendimento rendimento = new Rendimento();
            rendimento.setEntidadeEmpregadora(r.entidadeEmpregadora());
            rendimento.setValor(r.valor());
            cliente.adicionarRendimento(rendimento);
        }
    }

    private Cliente buscarCliente(String login) {
        return clienteRepository.findByLogin(login)
                .orElseThrow(() -> new NotFoundException("Cliente não encontrado"));
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}

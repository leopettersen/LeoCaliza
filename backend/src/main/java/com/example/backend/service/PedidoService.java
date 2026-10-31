package com.example.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.AutomovelRequest;
import com.example.backend.dto.AvaliacaoRequest;
import com.example.backend.dto.PedidoRequest;
import com.example.backend.dto.PedidoResponse;
import com.example.backend.dto.TipoProprietario;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.ForbiddenException;
import com.example.backend.exception.NotFoundException;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.model.Agente;
import com.example.backend.model.Automovel;
import com.example.backend.model.AvaliacaoFinanceira;
import com.example.backend.model.Cliente;
import com.example.backend.model.PedidoAluguel;
import com.example.backend.model.Usuario;
import com.example.backend.model.enums.Perfil;
import com.example.backend.model.enums.StatusPedido;
import com.example.backend.repository.AgenteRepository;
import com.example.backend.repository.AutomovelRepository;
import com.example.backend.repository.ClienteRepository;
import com.example.backend.repository.PedidoAluguelRepository;
import com.example.backend.repository.UsuarioRepository;

@Service
public class PedidoService {

    private final PedidoAluguelRepository pedidoRepository;
    private final AutomovelRepository automovelRepository;
    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;
    private final UsuarioRepository usuarioRepository;

    public PedidoService(PedidoAluguelRepository pedidoRepository,
                         AutomovelRepository automovelRepository,
                         ClienteRepository clienteRepository,
                         AgenteRepository agenteRepository,
                         UsuarioRepository usuarioRepository) {
        this.pedidoRepository = pedidoRepository;
        this.automovelRepository = automovelRepository;
        this.clienteRepository = clienteRepository;
        this.agenteRepository = agenteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public PedidoResponse criar(String login, PedidoRequest request) {
        validarDatas(request);
        Cliente cliente = buscarCliente(login);
        PedidoAluguel pedido = new PedidoAluguel();
        pedido.setCliente(cliente);
        pedido.setAutomovel(registrarAutomovel(cliente, request));
        pedido.setBancoCredito(buscarBancoCredito(request.bancoCreditoId()));
        pedido.setDataCriacao(LocalDate.now());
        pedido.setDataRetirada(request.dataRetirada());
        pedido.setDataDevolucao(request.dataDevolucao());
        pedido.setStatus(StatusPedido.EM_ANALISE);
        return PedidoResponse.from(pedidoRepository.save(pedido));
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listar(String login, StatusPedido status) {
        Usuario usuario = buscarUsuario(login);
        List<PedidoAluguel> pedidos = usuario.getPerfil() == Perfil.AGENTE
                ? listarTodos(status)
                : listarDoCliente(login, status);
        return pedidos.stream().map(PedidoResponse::from).toList();
    }

    private List<PedidoAluguel> listarTodos(StatusPedido status) {
        return status == null ? pedidoRepository.findAll() : pedidoRepository.findByStatus(status);
    }

    private List<PedidoAluguel> listarDoCliente(String login, StatusPedido status) {
        return status == null
                ? pedidoRepository.findByClienteLogin(login)
                : pedidoRepository.findByClienteLoginAndStatus(login, status);
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscar(String login, Long id) {
        return PedidoResponse.from(buscarPedidoVisivel(buscarUsuario(login), id));
    }

    @Transactional
    public PedidoResponse modificar(String login, Long id, PedidoRequest request) {
        validarDatas(request);
        Usuario usuario = buscarUsuario(login);
        PedidoAluguel pedido = buscarPedidoVisivel(usuario, id);
        if (pedido.getStatus() != StatusPedido.EM_ANALISE) {
            throw new ConflictException("Só é possível modificar pedido em análise");
        }
        pedido.setAutomovel(registrarAutomovel(pedido.getCliente(), request));
        pedido.setBancoCredito(buscarBancoCredito(request.bancoCreditoId()));
        pedido.setDataRetirada(request.dataRetirada());
        pedido.setDataDevolucao(request.dataDevolucao());
        pedido.setModificadoPor(usuario);
        pedido.setDataModificacao(LocalDateTime.now());
        return PedidoResponse.from(pedidoRepository.save(pedido));
    }

    @Transactional
    public void cancelar(String login, Long id) {
        PedidoAluguel pedido = buscarPedidoDoCliente(login, id);
        if (pedido.getStatus() == StatusPedido.CONTRATO_EXECUTADO
                || pedido.getStatus() == StatusPedido.CANCELADO) {
            throw new ConflictException("Pedido não pode mais ser cancelado");
        }
        pedido.setStatus(StatusPedido.CANCELADO);
        pedidoRepository.save(pedido);
    }

    @Transactional
    public PedidoResponse avaliar(String login, Long id, AvaliacaoRequest request) {
        Agente agente = buscarAgente(login);
        PedidoAluguel pedido = buscarPedido(id);
        if (pedido.getStatus() != StatusPedido.EM_ANALISE) {
            throw new ConflictException("Só é possível avaliar pedido em análise");
        }
        AvaliacaoFinanceira avaliacao = new AvaliacaoFinanceira();
        avaliacao.setAgente(agente);
        avaliacao.setResultado(request.resultado());
        avaliacao.setObservacao(request.observacao());
        pedido.setAvaliacao(avaliacao);
        pedido.setStatus(request.resultado() ? StatusPedido.APROVADO : StatusPedido.REPROVADO);
        return PedidoResponse.from(pedidoRepository.save(pedido));
    }

    private PedidoAluguel buscarPedidoVisivel(Usuario usuario, Long id) {
        PedidoAluguel pedido = buscarPedido(id);
        if (usuario.getPerfil() == Perfil.CLIENTE && !pedido.getCliente().getId().equals(usuario.getId())) {
            throw new ForbiddenException("Pedido pertence a outro cliente");
        }
        return pedido;
    }

    private PedidoAluguel buscarPedidoDoCliente(String login, Long id) {
        Cliente cliente = buscarCliente(login);
        PedidoAluguel pedido = buscarPedido(id);
        if (!pedido.getCliente().getId().equals(cliente.getId())) {
            throw new ForbiddenException("Pedido pertence a outro cliente");
        }
        return pedido;
    }

    private PedidoAluguel buscarPedido(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Pedido não encontrado"));
    }

    private Automovel registrarAutomovel(Cliente cliente, PedidoRequest request) {
        AutomovelRequest dados = request.automovel();
        Automovel automovel = automovelRepository.findByPlaca(dados.placa()).orElseGet(Automovel::new);
        if (automovel.getId() != null && !automovel.getMatricula().equals(dados.matricula())) {
            throw new ConflictException("Placa já cadastrada com outra matrícula");
        }
        if (automovel.getId() == null && automovelRepository.existsByMatricula(dados.matricula())) {
            throw new ConflictException("Matrícula já cadastrada com outra placa");
        }
        automovel.setMatricula(dados.matricula());
        automovel.setAno(dados.ano());
        automovel.setMarca(dados.marca());
        automovel.setModelo(dados.modelo());
        automovel.setPlaca(dados.placa());
        automovel.setProprietario(buscarProprietario(cliente, request));
        return automovelRepository.save(automovel);
    }

    private Usuario buscarProprietario(Cliente cliente, PedidoRequest request) {
        if (request.tipoProprietario() == TipoProprietario.CLIENTE) {
            return cliente;
        }
        if (request.proprietarioId() == null) {
            throw new BadRequestException("Informe a empresa ou o banco proprietário do automóvel");
        }
        Agente agente = agenteRepository.findById(request.proprietarioId())
                .orElseThrow(() -> new NotFoundException("Agente proprietário não encontrado"));
        if (TipoProprietario.de(agente) != request.tipoProprietario()) {
            throw new BadRequestException("O agente proprietário não é do tipo " + request.tipoProprietario());
        }
        return agente;
    }

    private Agente buscarBancoCredito(Long bancoId) {
        if (bancoId == null) {
            return null;
        }
        Agente banco = agenteRepository.findById(bancoId)
                .orElseThrow(() -> new NotFoundException("Banco não encontrado"));
        if (!banco.isBanco()) {
            throw new BadRequestException("Contrato de crédito só pode ser associado a um banco");
        }
        return banco;
    }

    private Cliente buscarCliente(String login) {
        return clienteRepository.findByLogin(login)
                .orElseThrow(() -> new UnauthorizedException("Cliente não encontrado"));
    }

    private Agente buscarAgente(String login) {
        return agenteRepository.findByLogin(login)
                .orElseThrow(() -> new UnauthorizedException("Agente não encontrado"));
    }

    private Usuario buscarUsuario(String login) {
        return usuarioRepository.findByLogin(login)
                .orElseThrow(() -> new UnauthorizedException("Usuário não encontrado"));
    }

    private void validarDatas(PedidoRequest request) {
        if (!request.dataDevolucao().isAfter(request.dataRetirada())) {
            throw new BadRequestException("A devolução deve ser depois da retirada");
        }
    }
}
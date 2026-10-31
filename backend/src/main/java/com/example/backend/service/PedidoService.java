package com.example.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.PedidoRequest;
import com.example.backend.dto.PedidoResponse;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.ForbiddenException;
import com.example.backend.exception.NotFoundException;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.model.Automovel;
import com.example.backend.model.Cliente;
import com.example.backend.model.PedidoAluguel;
import com.example.backend.model.Usuario;
import com.example.backend.model.enums.Perfil;
import com.example.backend.model.enums.StatusPedido;
import com.example.backend.repository.AutomovelRepository;
import com.example.backend.repository.ClienteRepository;
import com.example.backend.repository.PedidoAluguelRepository;
import com.example.backend.repository.UsuarioRepository;

@Service
public class PedidoService {

    private final PedidoAluguelRepository pedidoRepository;
    private final AutomovelRepository automovelRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    public PedidoService(PedidoAluguelRepository pedidoRepository,
                         AutomovelRepository automovelRepository,
                         ClienteRepository clienteRepository,
                         UsuarioRepository usuarioRepository) {
        this.pedidoRepository = pedidoRepository;
        this.automovelRepository = automovelRepository;
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public PedidoResponse criar(String login, PedidoRequest request) {
        validarDatas(request);
        Cliente cliente = buscarCliente(login);
        Automovel automovel = buscarAutomovel(request.automovelId());
        PedidoAluguel pedido = new PedidoAluguel();
        pedido.setCliente(cliente);
        pedido.setAutomovel(automovel);
        pedido.setDataCriacao(LocalDate.now());
        pedido.setDataRetirada(request.dataRetirada());
        pedido.setDataDevolucao(request.dataDevolucao());
        pedido.setStatus(StatusPedido.EM_ANALISE);
        return PedidoResponse.from(pedidoRepository.save(pedido));
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listar(String login) {
        Usuario usuario = buscarUsuario(login);
        List<PedidoAluguel> pedidos = usuario.getPerfil() == Perfil.AGENTE
                ? pedidoRepository.findAll()
                : pedidoRepository.findByClienteLogin(login);
        return pedidos.stream().map(PedidoResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscar(String login, Long id) {
        Usuario usuario = buscarUsuario(login);
        PedidoAluguel pedido = buscarPedido(id);
        if (usuario.getPerfil() == Perfil.CLIENTE && !pedido.getCliente().getId().equals(usuario.getId())) {
            throw new ForbiddenException("Pedido pertence a outro cliente");
        }
        return PedidoResponse.from(pedido);
    }

    @Transactional
    public PedidoResponse modificar(String login, Long id, PedidoRequest request) {
        validarDatas(request);
        PedidoAluguel pedido = buscarPedidoDoCliente(login, id);
        if (pedido.getStatus() != StatusPedido.EM_ANALISE) {
            throw new ConflictException("Só é possível modificar pedido em análise");
        }
        pedido.setAutomovel(buscarAutomovel(request.automovelId()));
        pedido.setDataRetirada(request.dataRetirada());
        pedido.setDataDevolucao(request.dataDevolucao());
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

    private Automovel buscarAutomovel(Long id) {
        return automovelRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Automóvel não encontrado"));
    }

    private Cliente buscarCliente(String login) {
        return clienteRepository.findByLogin(login)
                .orElseThrow(() -> new UnauthorizedException("Cliente não encontrado"));
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
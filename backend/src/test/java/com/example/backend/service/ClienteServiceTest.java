package com.example.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import com.example.backend.dto.ClienteRequest;
import com.example.backend.dto.ClienteResponse;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.RendimentoRequest;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ConflictException;
import com.example.backend.model.Cliente;
import com.example.backend.model.enums.Perfil;
import com.example.backend.repository.ClienteRepository;
import com.example.backend.repository.PedidoAluguelRepository;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    private static final String LOGIN = "maria";
    private static final String CPF = "123.456.789-00";

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private PedidoAluguelRepository pedidoRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private ClienteService clienteService;

    @Test
    void criarComAteTresRendimentosSalvaCliente() {
        when(clienteRepository.existsByCpf(CPF)).thenReturn(false);
        when(clienteRepository.save(any(Cliente.class))).thenAnswer(invocacao -> invocacao.getArgument(0));

        Cliente cliente = clienteService.criar(cadastro(rendimentos(3)));

        assertThat(cliente.getRendimentos()).hasSize(3);
        assertThat(cliente.getPerfil()).isEqualTo(Perfil.CLIENTE);
        assertThat(cliente.getRendimentos()).allMatch(rendimento -> rendimento.getCliente() == cliente);
    }

    @Test
    void criarComMaisDeTresRendimentosViolaRN01() {
        when(clienteRepository.existsByCpf(CPF)).thenReturn(false);

        assertThatThrownBy(() -> clienteService.criar(cadastro(rendimentos(4))))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("3 rendimentos");
        verify(clienteRepository, never()).save(any());
    }

    @Test
    void criarSemCpfOuRgLancaBadRequest() {
        RegisterRequest semDocumentos = new RegisterRequest(LOGIN, "segredo", Perfil.CLIENTE, "Maria",
                null, null, "Rua A", "Engenheira", List.of(), null);

        assertThatThrownBy(() -> clienteService.criar(semDocumentos)).isInstanceOf(BadRequestException.class);
    }

    @Test
    void criarComCpfJaCadastradoLancaConflict() {
        when(clienteRepository.existsByCpf(CPF)).thenReturn(true);

        assertThatThrownBy(() -> clienteService.criar(cadastro(List.of()))).isInstanceOf(ConflictException.class);
    }

    @Test
    void atualizarComMaisDeTresRendimentosViolaRN01() {
        when(clienteRepository.findByLogin(LOGIN)).thenReturn(Optional.of(clienteExistente()));

        assertThatThrownBy(() -> clienteService.atualizar(LOGIN, dadosCliente(rendimentos(4))))
                .isInstanceOf(BadRequestException.class);
        verify(clienteRepository, never()).save(any());
    }

    @Test
    void atualizarSubstituiRendimentos() {
        when(clienteRepository.findByLogin(LOGIN)).thenReturn(Optional.of(clienteExistente()));
        when(clienteRepository.save(any(Cliente.class))).thenAnswer(invocacao -> invocacao.getArgument(0));

        ClienteResponse resposta = clienteService.atualizar(LOGIN, dadosCliente(rendimentos(2)));

        assertThat(resposta.rendimentos()).hasSize(2);
    }

    @Test
    void excluirClienteComPedidosLancaConflict() {
        Cliente cliente = clienteExistente();
        when(clienteRepository.findByLogin(LOGIN)).thenReturn(Optional.of(cliente));
        when(pedidoRepository.existsByClienteId(cliente.getId())).thenReturn(true);

        assertThatThrownBy(() -> clienteService.excluir(LOGIN)).isInstanceOf(ConflictException.class);
        verify(clienteRepository, never()).delete(any());
    }

    @Test
    void excluirClienteSemPedidosRemoveCliente() {
        Cliente cliente = clienteExistente();
        when(clienteRepository.findByLogin(LOGIN)).thenReturn(Optional.of(cliente));
        when(pedidoRepository.existsByClienteId(cliente.getId())).thenReturn(false);

        clienteService.excluir(LOGIN);

        verify(clienteRepository).delete(cliente);
    }

    private List<RendimentoRequest> rendimentos(int quantidade) {
        return IntStream.range(0, quantidade)
                .mapToObj(indice -> new RendimentoRequest("Empresa " + indice, BigDecimal.valueOf(1000)))
                .toList();
    }

    private RegisterRequest cadastro(List<RendimentoRequest> rendimentos) {
        return new RegisterRequest(LOGIN, "segredo", Perfil.CLIENTE, "Maria", "MG-1", CPF, "Rua A",
                "Engenheira", rendimentos, null);
    }

    private ClienteRequest dadosCliente(List<RendimentoRequest> rendimentos) {
        return new ClienteRequest("Maria", "MG-1", CPF, "Rua A", "Engenheira", rendimentos);
    }

    private Cliente clienteExistente() {
        Cliente cliente = new Cliente();
        ReflectionTestUtils.setField(cliente, "id", 1L);
        cliente.setLogin(LOGIN);
        cliente.setCpf(CPF);
        cliente.setPerfil(Perfil.CLIENTE);
        return cliente;
    }
}

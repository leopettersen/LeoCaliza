package com.example.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.example.backend.dto.AutomovelRequest;
import com.example.backend.dto.AvaliacaoRequest;
import com.example.backend.dto.ContratoCreditoRequest;
import com.example.backend.dto.PedidoRequest;
import com.example.backend.dto.PedidoResponse;
import com.example.backend.dto.TipoProprietario;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.ForbiddenException;
import com.example.backend.model.Agente;
import com.example.backend.model.Automovel;
import com.example.backend.model.Cliente;
import com.example.backend.model.ContratoCredito;
import com.example.backend.model.PedidoAluguel;
import com.example.backend.model.enums.Perfil;
import com.example.backend.model.enums.StatusPedido;
import com.example.backend.model.enums.TipoAgente;
import com.example.backend.repository.AgenteRepository;
import com.example.backend.repository.AutomovelRepository;
import com.example.backend.repository.ClienteRepository;
import com.example.backend.repository.PedidoAluguelRepository;
import com.example.backend.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    private static final String LOGIN_CLIENTE = "maria";
    private static final String LOGIN_AGENTE = "banco.azul";
    private static final Long ID_PEDIDO = 42L;

    @Mock
    private PedidoAluguelRepository pedidoRepository;

    @Mock
    private AutomovelRepository automovelRepository;

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private AgenteRepository agenteRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private PedidoService pedidoService;

    @Test
    void criarPedidoComecaEmAnaliseRN02() {
        prepararCriacao(cliente(1L, LOGIN_CLIENTE));

        PedidoResponse resposta = pedidoService.criar(LOGIN_CLIENTE, requisicao(TipoProprietario.CLIENTE, null, null));

        assertThat(resposta.status()).isEqualTo(StatusPedido.EM_ANALISE);
    }

    @Test
    void criarPedidoRegistraDadosDoAutomovelRN06() {
        prepararCriacao(cliente(1L, LOGIN_CLIENTE));

        PedidoResponse resposta = pedidoService.criar(LOGIN_CLIENTE, requisicao(TipoProprietario.CLIENTE, null, null));

        assertThat(resposta.automovel().matricula()).isEqualTo("MAT-1");
        assertThat(resposta.automovel().ano()).isEqualTo(2022);
        assertThat(resposta.automovel().marca()).isEqualTo("Fiat");
        assertThat(resposta.automovel().modelo()).isEqualTo("Argo");
        assertThat(resposta.automovel().placa()).isEqualTo("ABC1D23");
    }

    @Test
    void proprietarioPodeSerClienteRN04() {
        prepararCriacao(cliente(1L, LOGIN_CLIENTE));

        PedidoResponse resposta = pedidoService.criar(LOGIN_CLIENTE, requisicao(TipoProprietario.CLIENTE, null, null));

        assertThat(resposta.automovel().tipoProprietario()).isEqualTo(TipoProprietario.CLIENTE);
    }

    @Test
    void proprietarioPodeSerEmpresaRN04() {
        prepararCriacao(cliente(1L, LOGIN_CLIENTE));
        when(agenteRepository.findById(5L)).thenReturn(Optional.of(agente(5L, TipoAgente.EMPRESA)));

        PedidoResponse resposta = pedidoService.criar(LOGIN_CLIENTE, requisicao(TipoProprietario.EMPRESA, 5L, null));

        assertThat(resposta.automovel().tipoProprietario()).isEqualTo(TipoProprietario.EMPRESA);
    }

    @Test
    void proprietarioPodeSerBancoRN04() {
        prepararCriacao(cliente(1L, LOGIN_CLIENTE));
        when(agenteRepository.findById(10L)).thenReturn(Optional.of(agente(10L, TipoAgente.BANCO)));

        PedidoResponse resposta = pedidoService.criar(LOGIN_CLIENTE, requisicao(TipoProprietario.BANCO, 10L, null));

        assertThat(resposta.automovel().tipoProprietario()).isEqualTo(TipoProprietario.BANCO);
    }

    @Test
    void proprietarioDeTipoDiferenteDoInformadoLancaBadRequest() {
        when(clienteRepository.findByLogin(LOGIN_CLIENTE)).thenReturn(Optional.of(cliente(1L, LOGIN_CLIENTE)));
        when(automovelRepository.findByPlaca("ABC1D23")).thenReturn(Optional.empty());
        when(automovelRepository.existsByMatricula("MAT-1")).thenReturn(false);
        when(agenteRepository.findById(5L)).thenReturn(Optional.of(agente(5L, TipoAgente.EMPRESA)));

        assertThatThrownBy(() -> pedidoService.criar(LOGIN_CLIENTE, requisicao(TipoProprietario.BANCO, 5L, null)))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void creditoOpcionalAssociadoAUmBancoRN05() {
        prepararCriacao(cliente(1L, LOGIN_CLIENTE));
        when(agenteRepository.findById(10L)).thenReturn(Optional.of(agente(10L, TipoAgente.BANCO)));

        PedidoResponse resposta = pedidoService.criar(LOGIN_CLIENTE, requisicao(TipoProprietario.CLIENTE, null, 10L));

        assertThat(resposta.bancoCreditoId()).isEqualTo(10L);
    }

    @Test
    void creditoAssociadoAEmpresaViolaRN05() {
        when(clienteRepository.findByLogin(LOGIN_CLIENTE)).thenReturn(Optional.of(cliente(1L, LOGIN_CLIENTE)));
        when(automovelRepository.findByPlaca("ABC1D23")).thenReturn(Optional.empty());
        when(automovelRepository.existsByMatricula("MAT-1")).thenReturn(false);
        when(automovelRepository.save(any(Automovel.class))).thenAnswer(invocacao -> invocacao.getArgument(0));
        when(agenteRepository.findById(5L)).thenReturn(Optional.of(agente(5L, TipoAgente.EMPRESA)));

        assertThatThrownBy(() -> pedidoService.criar(LOGIN_CLIENTE, requisicao(TipoProprietario.CLIENTE, null, 5L)))
                .isInstanceOf(BadRequestException.class);
        verify(pedidoRepository, never()).save(any());
    }

    @Test
    void placaExistenteComOutraMatriculaLancaConflict() {
        Automovel existente = new Automovel();
        ReflectionTestUtils.setField(existente, "id", 7L);
        existente.setMatricula("OUTRA");
        when(clienteRepository.findByLogin(LOGIN_CLIENTE)).thenReturn(Optional.of(cliente(1L, LOGIN_CLIENTE)));
        when(automovelRepository.findByPlaca("ABC1D23")).thenReturn(Optional.of(existente));

        assertThatThrownBy(() -> pedidoService.criar(LOGIN_CLIENTE, requisicao(TipoProprietario.CLIENTE, null, null)))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void devolucaoAntesDaRetiradaLancaBadRequest() {
        PedidoRequest datasInvertidas = new PedidoRequest(automovel(), TipoProprietario.CLIENTE, null, null,
                LocalDate.now().plusDays(5), LocalDate.now().plusDays(1));

        assertThatThrownBy(() -> pedidoService.criar(LOGIN_CLIENTE, datasInvertidas))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void clienteNaoVePedidoDeOutroClienteRN03() {
        when(usuarioRepository.findByLogin(LOGIN_CLIENTE)).thenReturn(Optional.of(cliente(1L, LOGIN_CLIENTE)));
        when(pedidoRepository.findById(ID_PEDIDO))
                .thenReturn(Optional.of(pedido(cliente(2L, "outro"), StatusPedido.EM_ANALISE)));

        assertThatThrownBy(() -> pedidoService.buscar(LOGIN_CLIENTE, ID_PEDIDO))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void clienteListaApenasOsPropriosPedidosRN03() {
        when(usuarioRepository.findByLogin(LOGIN_CLIENTE)).thenReturn(Optional.of(cliente(1L, LOGIN_CLIENTE)));
        when(pedidoRepository.findByClienteLogin(LOGIN_CLIENTE)).thenReturn(List.of());

        pedidoService.listar(LOGIN_CLIENTE, null);

        verify(pedidoRepository).findByClienteLogin(LOGIN_CLIENTE);
        verify(pedidoRepository, never()).findAll();
    }

    @Test
    void agenteListaTodosOsPedidosRN03() {
        when(usuarioRepository.findByLogin(LOGIN_AGENTE)).thenReturn(Optional.of(agente(10L, TipoAgente.BANCO)));
        when(pedidoRepository.findAll()).thenReturn(List.of());

        pedidoService.listar(LOGIN_AGENTE, null);

        verify(pedidoRepository).findAll();
    }

    @Test
    void modificarPedidoForaDeAnaliseLancaConflict() {
        Cliente dono = cliente(1L, LOGIN_CLIENTE);
        when(usuarioRepository.findByLogin(LOGIN_CLIENTE)).thenReturn(Optional.of(dono));
        when(pedidoRepository.findById(ID_PEDIDO)).thenReturn(Optional.of(pedido(dono, StatusPedido.APROVADO)));

        assertThatThrownBy(() -> pedidoService.modificar(LOGIN_CLIENTE, ID_PEDIDO,
                requisicao(TipoProprietario.CLIENTE, null, null))).isInstanceOf(ConflictException.class);
    }

    @Test
    void cancelarAntesDaExecucaoMudaParaCanceladoRN02() {
        Cliente dono = cliente(1L, LOGIN_CLIENTE);
        PedidoAluguel pedido = pedido(dono, StatusPedido.APROVADO);
        when(clienteRepository.findByLogin(LOGIN_CLIENTE)).thenReturn(Optional.of(dono));
        when(pedidoRepository.findById(ID_PEDIDO)).thenReturn(Optional.of(pedido));

        pedidoService.cancelar(LOGIN_CLIENTE, ID_PEDIDO);

        assertThat(pedido.getStatus()).isEqualTo(StatusPedido.CANCELADO);
    }

    @Test
    void cancelarDepoisDaExecucaoLancaConflictRN02() {
        Cliente dono = cliente(1L, LOGIN_CLIENTE);
        when(clienteRepository.findByLogin(LOGIN_CLIENTE)).thenReturn(Optional.of(dono));
        when(pedidoRepository.findById(ID_PEDIDO))
                .thenReturn(Optional.of(pedido(dono, StatusPedido.CONTRATO_EXECUTADO)));

        assertThatThrownBy(() -> pedidoService.cancelar(LOGIN_CLIENTE, ID_PEDIDO))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void parecerPositivoAprovaPedidoRN02() {
        PedidoAluguel pedido = prepararPedidoParaAgente(agente(10L, TipoAgente.EMPRESA), StatusPedido.EM_ANALISE);

        pedidoService.avaliar(LOGIN_AGENTE, ID_PEDIDO, new AvaliacaoRequest(true, "Renda compatível"));

        assertThat(pedido.getStatus()).isEqualTo(StatusPedido.APROVADO);
        assertThat(pedido.getAvaliacao().getResultado()).isTrue();
    }

    @Test
    void parecerNegativoReprovaPedidoRN02() {
        PedidoAluguel pedido = prepararPedidoParaAgente(agente(10L, TipoAgente.EMPRESA), StatusPedido.EM_ANALISE);

        pedidoService.avaliar(LOGIN_AGENTE, ID_PEDIDO, new AvaliacaoRequest(false, "Renda insuficiente"));

        assertThat(pedido.getStatus()).isEqualTo(StatusPedido.REPROVADO);
    }

    @Test
    void avaliarPedidoForaDeAnaliseLancaConflict() {
        Agente agente = agente(10L, TipoAgente.EMPRESA);
        when(agenteRepository.findByLogin(LOGIN_AGENTE)).thenReturn(Optional.of(agente));
        when(pedidoRepository.findById(ID_PEDIDO))
                .thenReturn(Optional.of(pedido(cliente(1L, LOGIN_CLIENTE), StatusPedido.APROVADO)));

        assertThatThrownBy(() -> pedidoService.avaliar(LOGIN_AGENTE, ID_PEDIDO, new AvaliacaoRequest(true, "ok")))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void empresaNaoConcedeCreditoRN05() {
        when(agenteRepository.findByLogin(LOGIN_AGENTE)).thenReturn(Optional.of(agente(5L, TipoAgente.EMPRESA)));

        assertThatThrownBy(() -> pedidoService.concederCredito(LOGIN_AGENTE, ID_PEDIDO, credito()))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void bancoDiferenteDoSolicitadoNaoConcedeCredito() {
        Agente banco = agente(10L, TipoAgente.BANCO);
        PedidoAluguel pedido = pedido(cliente(1L, LOGIN_CLIENTE), StatusPedido.EM_ANALISE);
        pedido.setBancoCredito(agente(11L, TipoAgente.BANCO));
        when(agenteRepository.findByLogin(LOGIN_AGENTE)).thenReturn(Optional.of(banco));
        when(pedidoRepository.findById(ID_PEDIDO)).thenReturn(Optional.of(pedido));

        assertThatThrownBy(() -> pedidoService.concederCredito(LOGIN_AGENTE, ID_PEDIDO, credito()))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void bancoSolicitadoConcedeCreditoRN05() {
        Agente banco = agente(10L, TipoAgente.BANCO);
        PedidoAluguel pedido = prepararPedidoParaAgente(banco, StatusPedido.APROVADO);
        pedido.setBancoCredito(banco);

        pedidoService.concederCredito(LOGIN_AGENTE, ID_PEDIDO, credito());

        assertThat(pedido.getContratoCredito().getValor()).isEqualByComparingTo("15000");
        assertThat(pedido.getContratoCredito().getPrazoMeses()).isEqualTo(12);
        assertThat(pedido.getContratoCredito().getAgente()).isSameAs(banco);
    }

    @Test
    void executarContratoDePedidoNaoAprovadoLancaConflict() {
        when(agenteRepository.findByLogin(LOGIN_AGENTE)).thenReturn(Optional.of(agente(5L, TipoAgente.EMPRESA)));
        when(pedidoRepository.findById(ID_PEDIDO))
                .thenReturn(Optional.of(pedido(cliente(1L, LOGIN_CLIENTE), StatusPedido.EM_ANALISE)));

        assertThatThrownBy(() -> pedidoService.executarContrato(LOGIN_AGENTE, ID_PEDIDO))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void executarContratoAguardandoCreditoLancaConflict() {
        PedidoAluguel pedido = pedido(cliente(1L, LOGIN_CLIENTE), StatusPedido.APROVADO);
        pedido.setBancoCredito(agente(10L, TipoAgente.BANCO));
        when(agenteRepository.findByLogin(LOGIN_AGENTE)).thenReturn(Optional.of(agente(5L, TipoAgente.EMPRESA)));
        when(pedidoRepository.findById(ID_PEDIDO)).thenReturn(Optional.of(pedido));

        assertThatThrownBy(() -> pedidoService.executarContrato(LOGIN_AGENTE, ID_PEDIDO))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void executarContratoDePedidoAprovadoRN02() {
        Agente banco = agente(10L, TipoAgente.BANCO);
        PedidoAluguel pedido = prepararPedidoParaAgente(agente(5L, TipoAgente.EMPRESA), StatusPedido.APROVADO);
        pedido.setBancoCredito(banco);
        ContratoCredito contrato = new ContratoCredito();
        contrato.setAgente(banco);
        contrato.setValor(BigDecimal.TEN);
        contrato.setPrazoMeses(1);
        pedido.setContratoCredito(contrato);

        pedidoService.executarContrato(LOGIN_AGENTE, ID_PEDIDO);

        assertThat(pedido.getStatus()).isEqualTo(StatusPedido.CONTRATO_EXECUTADO);
        assertThat(pedido.getContratoAluguel()).isNotNull();
    }

    private void prepararCriacao(Cliente cliente) {
        when(clienteRepository.findByLogin(cliente.getLogin())).thenReturn(Optional.of(cliente));
        when(automovelRepository.findByPlaca("ABC1D23")).thenReturn(Optional.empty());
        when(automovelRepository.existsByMatricula("MAT-1")).thenReturn(false);
        when(automovelRepository.save(any(Automovel.class))).thenAnswer(invocacao -> invocacao.getArgument(0));
        when(pedidoRepository.save(any(PedidoAluguel.class))).thenAnswer(invocacao -> invocacao.getArgument(0));
    }

    private PedidoAluguel prepararPedidoParaAgente(Agente agente, StatusPedido status) {
        PedidoAluguel pedido = pedido(cliente(1L, LOGIN_CLIENTE), status);
        when(agenteRepository.findByLogin(LOGIN_AGENTE)).thenReturn(Optional.of(agente));
        when(pedidoRepository.findById(ID_PEDIDO)).thenReturn(Optional.of(pedido));
        when(pedidoRepository.save(pedido)).thenReturn(pedido);
        return pedido;
    }

    private AutomovelRequest automovel() {
        return new AutomovelRequest("MAT-1", 2022, "Fiat", "Argo", "ABC1D23");
    }

    private PedidoRequest requisicao(TipoProprietario tipo, Long proprietarioId, Long bancoCreditoId) {
        return new PedidoRequest(automovel(), tipo, proprietarioId, bancoCreditoId,
                LocalDate.now().plusDays(1), LocalDate.now().plusDays(7));
    }

    private ContratoCreditoRequest credito() {
        return new ContratoCreditoRequest(new BigDecimal("15000"), 12);
    }

    private Cliente cliente(Long id, String login) {
        Cliente cliente = new Cliente();
        ReflectionTestUtils.setField(cliente, "id", id);
        cliente.setLogin(login);
        cliente.setNome("Maria");
        cliente.setPerfil(Perfil.CLIENTE);
        return cliente;
    }

    private Agente agente(Long id, TipoAgente tipo) {
        Agente agente = new Agente();
        ReflectionTestUtils.setField(agente, "id", id);
        agente.setLogin(LOGIN_AGENTE);
        agente.setNome(tipo == TipoAgente.BANCO ? "Banco Azul" : "Locadora Sol");
        agente.setPerfil(Perfil.AGENTE);
        agente.setTipo(tipo);
        return agente;
    }

    private PedidoAluguel pedido(Cliente cliente, StatusPedido status) {
        Automovel automovel = new Automovel();
        automovel.setMatricula("MAT-1");
        automovel.setPlaca("ABC1D23");
        automovel.setProprietario(cliente);
        PedidoAluguel pedido = new PedidoAluguel();
        ReflectionTestUtils.setField(pedido, "id", ID_PEDIDO);
        pedido.setCliente(cliente);
        pedido.setAutomovel(automovel);
        pedido.setStatus(status);
        return pedido;
    }
}

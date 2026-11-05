import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import { STATUS_PEDIDO } from '@/constants/status.ts';
import { TEXTOS } from '@/constants/textos.ts';
import { REGRAS_VALIDACAO } from '@/constants/validacao.ts';
import { extrairMensagemDeErro } from '@/services/api.ts';
import { avaliarPedido } from '@/services/pedidoService.ts';
import type { Pedido } from '@/types/pedido.ts';
import { formatarNumeroPedido } from '@/utils/formatacao.ts';

interface PropriedadesAcoesAceite {
  pedido: Pedido;
  aoResponder: () => void;
}

export function AcoesAceite({ pedido, aoResponder }: PropriedadesAcoesAceite) {
  const [aceitar, setAceitar] = useState<boolean | null>(null);
  const [observacao, setObservacao] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const pendente = pedido.status === STATUS_PEDIDO.emAnalise;
  const numero = formatarNumeroPedido(pedido.id);

  function abrir(valor: boolean) {
    setObservacao('');
    setErro(null);
    setAceitar(valor);
  }

  async function confirmar() {
    if (aceitar === null) {
      return;
    }
    setEnviando(true);
    setErro(null);
    try {
      await avaliarPedido(pedido.id, { resultado: aceitar, observacao: observacao.trim() });
      setAceitar(null);
      aoResponder();
    } catch (falha) {
      setErro(extrairMensagemDeErro(falha));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Button size="small" variant="contained" color="success" disabled={!pendente} onClick={() => abrir(true)}>
        {TEXTOS.aceitePedido.botaoAceitar}
      </Button>
      <Button size="small" variant="outlined" color="error" disabled={!pendente} onClick={() => abrir(false)}>
        {TEXTOS.aceitePedido.botaoRecusar}
      </Button>
      <Dialog open={aceitar !== null} onClose={() => setAceitar(null)} fullWidth maxWidth="sm">
        <DialogTitle>
          {aceitar ? TEXTOS.aceitePedido.tituloAceitar(numero) : TEXTOS.aceitePedido.tituloRecusar(numero)}
        </DialogTitle>
        <DialogContent>
          {erro && <Alert severity="error">{erro}</Alert>}
          <TextField
            label={TEXTOS.aceitePedido.campoObservacao}
            value={observacao}
            onChange={(evento) => setObservacao(evento.target.value)}
            slotProps={{ htmlInput: { maxLength: REGRAS_VALIDACAO.tamanhoMaximoObservacao } }}
            margin="normal"
            multiline
            minRows={2}
            fullWidth
            autoFocus
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAceitar(null)} disabled={enviando}>
            {TEXTOS.aceitePedido.botaoVoltar}
          </Button>
          <Button variant="contained" onClick={confirmar} disabled={enviando || !observacao.trim()}>
            {enviando ? TEXTOS.aceitePedido.enviando : TEXTOS.aceitePedido.botaoConfirmar}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

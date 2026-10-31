import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  type SxProps,
  type Theme,
} from '@mui/material'

interface PropriedadesDialogoConfirmacao {
  aberto: boolean
  titulo: string
  texto: string
  rotuloConfirmar: string
  rotuloCancelar: string
  processando?: boolean
  erro?: string | null
  corConfirmar?: 'error' | 'primary'
  aoConfirmar: () => void
  aoCancelar: () => void
}

export function DialogoConfirmacao({
  aberto,
  titulo,
  texto,
  rotuloConfirmar,
  rotuloCancelar,
  processando = false,
  erro = null,
  corConfirmar = 'error',
  aoConfirmar,
  aoCancelar,
}: PropriedadesDialogoConfirmacao) {
  return (
    <Dialog open={aberto} onClose={processando ? undefined : aoCancelar}>
      <DialogTitle>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText>{texto}</DialogContentText>
        {erro && (
          <Alert severity="error" sx={estilos.erro}>
            {erro}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={aoCancelar} disabled={processando}>
          {rotuloCancelar}
        </Button>
        <Button variant="contained" color={corConfirmar} onClick={aoConfirmar} disabled={processando}>
          {rotuloConfirmar}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const estilos = {
  erro: {
    mt: 2,
  },
} satisfies Record<string, SxProps<Theme>>

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

interface PropriedadesDialogoConfirmacao {
  aberto: boolean
  titulo: string
  texto: string
  rotuloConfirmar: string
  rotuloCancelar: string
  processando?: boolean
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
  aoConfirmar,
  aoCancelar,
}: PropriedadesDialogoConfirmacao) {
  return (
    <Dialog open={aberto} onClose={processando ? undefined : aoCancelar}>
      <DialogTitle>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText>{texto}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={aoCancelar} disabled={processando}>
          {rotuloCancelar}
        </Button>
        <Button variant="contained" color="error" onClick={aoConfirmar} disabled={processando}>
          {rotuloConfirmar}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

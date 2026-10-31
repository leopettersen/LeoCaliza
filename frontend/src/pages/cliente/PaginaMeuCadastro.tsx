import { Alert, Box, TextField, Typography, type SxProps, type Theme } from '@mui/material'
import { useState, type ChangeEvent } from 'react'
import { Carregando } from '../../components/Carregando.tsx'
import { SecaoFormulario } from '../../components/SecaoFormulario.tsx'
import { TEXTOS } from '../../constants/textos.ts'
import { useMeuCadastro } from '../../hooks/useMeuCadastro.ts'
import type { Cliente } from '../../types/cliente.ts'

type CampoIdentificacao = 'nome' | 'cpf' | 'rg' | 'endereco' | 'profissao'

export function PaginaMeuCadastro() {
  const { cliente, carregando, erro } = useMeuCadastro()

  return (
    <Box sx={estilos.pagina}>
      <Typography variant="h4" component="h1">
        {TEXTOS.meuCadastro.titulo}
      </Typography>
      {carregando && <Carregando />}
      {erro && <Alert severity="error">{erro}</Alert>}
      {cliente && !carregando && <FormularioMeuCadastro cliente={cliente} />}
    </Box>
  )
}

function FormularioMeuCadastro({ cliente }: { cliente: Cliente }) {
  const [identificacao, setIdentificacao] = useState({
    nome: cliente.nome,
    cpf: cliente.cpf,
    rg: cliente.rg,
    endereco: cliente.endereco,
    profissao: cliente.profissao,
  })

  function alterarCampo(campo: CampoIdentificacao) {
    return (evento: ChangeEvent<HTMLInputElement>) =>
      setIdentificacao((atual) => ({ ...atual, [campo]: evento.target.value }))
  }

  return (
    <Box component="form" sx={estilos.formulario}>
      <SecaoFormulario titulo={TEXTOS.meuCadastro.secaoIdentificacao}>
        <Box sx={estilos.linhaTripla}>
          <TextField
            label={TEXTOS.camposCliente.nome}
            value={identificacao.nome}
            onChange={alterarCampo('nome')}
            required
          />
          <TextField
            label={TEXTOS.camposCliente.cpf}
            placeholder={TEXTOS.camposCliente.exemploCpf}
            value={identificacao.cpf}
            onChange={alterarCampo('cpf')}
            required
          />
          <TextField
            label={TEXTOS.camposCliente.rg}
            value={identificacao.rg}
            onChange={alterarCampo('rg')}
            required
          />
        </Box>
        <TextField
          label={TEXTOS.camposCliente.endereco}
          value={identificacao.endereco}
          onChange={alterarCampo('endereco')}
          required
          fullWidth
        />
        <TextField
          label={TEXTOS.camposCliente.profissao}
          value={identificacao.profissao}
          onChange={alterarCampo('profissao')}
          required
          fullWidth
        />
      </SecaoFormulario>
    </Box>
  )
}

const estilos = {
  pagina: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  linhaTripla: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
    gap: 2,
  },
} satisfies Record<string, SxProps<Theme>>

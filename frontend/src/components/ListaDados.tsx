import { Box, Typography, type SxProps, type Theme } from '@mui/material'

export interface ItemDado {
  rotulo: string
  valor: string
}

export function ListaDados({ itens }: { itens: ItemDado[] }) {
  return (
    <Box component="dl" sx={estilos.lista}>
      {itens.map((item) => (
        <Box key={item.rotulo} sx={estilos.item}>
          <Typography component="dt" variant="body2" color="text.secondary">
            {item.rotulo}
          </Typography>
          <Typography component="dd" sx={estilos.valor}>
            {item.valor}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

const estilos = {
  lista: {
    m: 0,
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
    gap: 2,
  },
  item: {
    minWidth: 0,
  },
  valor: {
    m: 0,
    overflowWrap: 'anywhere',
  },
} satisfies Record<string, SxProps<Theme>>

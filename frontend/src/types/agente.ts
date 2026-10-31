import type { TipoAgente } from './auth.ts'

export interface Agente {
  id: number
  nome: string
  tipo: TipoAgente
}

import type { TipoAgente } from '@/types/auth.ts';

export interface Agente {
  id: number;
  nome: string;
  tipo: TipoAgente;
}

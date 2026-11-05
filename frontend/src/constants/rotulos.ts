import type { TipoProprietario } from '@/types/pedido.ts';
import { TIPOS_PROPRIETARIO } from '@/constants/perfis.ts';
import { TEXTOS } from '@/constants/textos.ts';

export const ROTULOS_TIPO_PROPRIETARIO: Record<TipoProprietario, string> = {
  [TIPOS_PROPRIETARIO.cliente]: TEXTOS.tiposProprietario.cliente,
  [TIPOS_PROPRIETARIO.empresa]: TEXTOS.tiposProprietario.empresa,
  [TIPOS_PROPRIETARIO.banco]: TEXTOS.tiposProprietario.banco,
};

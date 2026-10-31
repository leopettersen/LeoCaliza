import { useCallback, useEffect, useState } from 'react'
import { extrairMensagemDeErro } from '../services/api.ts'

export function useRequisicao<T>(buscar: () => Promise<T>) {
  const [dados, setDados] = useState<T | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [versao, setVersao] = useState(0)

  useEffect(() => {
    let ativo = true
    buscar()
      .then((resultado) => {
        if (ativo) {
          setDados(resultado)
          setErro(null)
        }
      })
      .catch((falha: unknown) => {
        if (ativo) {
          setErro(extrairMensagemDeErro(falha))
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false)
        }
      })
    return () => {
      ativo = false
    }
  }, [buscar, versao])

  const recarregar = useCallback(() => {
    setCarregando(true)
    setVersao((atual) => atual + 1)
  }, [])

  return { dados, carregando, erro, recarregar }
}

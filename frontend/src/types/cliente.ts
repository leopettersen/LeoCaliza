export interface Rendimento {
  id?: number
  entidadeEmpregadora: string
  valor: number
}

export interface Cliente {
  id: number
  login: string
  nome: string
  rg: string
  cpf: string
  endereco: string
  profissao: string
  rendimentos: Rendimento[]
}

export interface DadosCliente {
  nome: string
  rg: string
  cpf: string
  endereco: string
  profissao: string
  rendimentos: Rendimento[]
}

# LeoCaliza

> [!NOTE]
> Sistema web para gestão de aluguéis de automóveis: o cliente cria, consulta, modifica e cancela pedidos pela Internet, e os agentes (empresas e bancos) avaliam financeiramente cada pedido e executam o contrato.

<table>
  <tr>
    <td width="600px">
      <div align="justify">
        O <b>LeoCaliza</b> foi desenvolvido no <b>Laboratório 02</b> da disciplina de <b>Desenvolvimento e Integração de Aplicações Web (DIAW)</b>, do curso de Engenharia de Software da PUC Minas. O sistema centraliza o fluxo de aluguel de automóveis: cadastro e login obrigatórios, pedidos de aluguel com status acompanhável, análise financeira feita por agentes e contratos de crédito concedidos por bancos. O projeto segue a arquitetura <b>MVC</b> no back-end (Spring Boot), usa <b>React + TypeScript + Vite + MUI</b> no front-end e <b>Supabase (PostgreSQL)</b> como banco de dados, com a modelagem UML versionada junto ao código.
      </div>
    </td>
    <td width="250px">
      <div>
        <img src="docs/logo.webp" alt="Logo do LeoCaliza" width="250px"/>
      </div>
    </td>
  </tr>
</table>

---

## 🚧 Status do Projeto

![Java](https://img.shields.io/badge/Java-25-007ec6?style=for-the-badge&logo=openjdk&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.2-007ec6?style=for-the-badge&logo=springboot&logoColor=white) ![Maven](https://img.shields.io/badge/Maven-build-007ec6?style=for-the-badge&logo=apachemaven&logoColor=white) ![React](https://img.shields.io/badge/React-19-007ec6?style=for-the-badge&logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-7-007ec6?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-8-007ec6?style=for-the-badge&logo=vite&logoColor=white) ![MUI](https://img.shields.io/badge/MUI-9-007ec6?style=for-the-badge&logo=mui&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-007ec6?style=for-the-badge&logo=supabase&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-Compose-007ec6?style=for-the-badge&logo=docker&logoColor=white)

✅ **Finalizado** Implementação completa.

---

## 📚 Índice
- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias e Bibliotecas](#-tecnologias-e-bibliotecas)
  - [Front-end](#-front-end)
  - [Back-end](#-back-end)
  - [Banco de dados](#-banco-de-dados)
  - [Infraestrutura e DevOps](#-infraestrutura-e-devops)
- [Arquitetura](#-arquitetura)
  - [API REST](#-api-rest)
- [Instalação e Execução](#-instalação-e-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Variáveis de Ambiente](#-variáveis-de-ambiente)
  - [Instalação de Dependências](#-instalação-de-dependências)
  - [Banco de Dados (Supabase)](#-banco-de-dados-supabase)
  - [Como Executar a Aplicação](#-como-executar-a-aplicação)
  - [Como Executar com Docker](#-como-executar-com-docker)
- [Deploy](#-deploy)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
- [Testes](#-testes)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autor](#-autor)
- [Contribuição](#-contribuição)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 🔗 Links Úteis
* 🌐 **Demo Online:** [leo-caliza.vercel.app](https://leo-caliza.vercel.app/)
* 📖 **Documentação de modelagem:** [pasta `docs/`](./docs)
  > 📚 Casos de uso, histórias do usuário, diagramas de classes e de pacotes e wireframes.

---

## 📝 Sobre o Projeto

Gerir aluguéis de automóveis envolve vários participantes: o cliente que contrata, a empresa ou o banco que avalia a capacidade financeira e, muitas vezes, um banco que concede o crédito. Fazer isso sem um sistema centralizado dificulta acompanhar o andamento de cada pedido.

O LeoCaliza resolve isso oferecendo um ponto único pela Internet:

- O **cliente** mantém seus dados (identificação, profissão e até 3 rendimentos) e acompanha o status de cada pedido de aluguel.
- O **agente** (empresa ou banco) analisa financeiramente os pedidos e, com parecer positivo, executa o contrato.
- O **banco** pode conceder o contrato de crédito associado ao aluguel.

O projeto nasceu como trabalho acadêmico (DIAW, PUC Minas) e serve também como peça do portfólio profissional.

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação:** cadastro e login obrigatórios, com perfis de Cliente e Agente.
- 👤 **CRUD de cliente:** identificação (RG, CPF, nome, endereço), profissão e até 3 rendimentos com entidade empregadora.
- 📝 **Pedidos de aluguel:** o cliente cria, consulta, modifica e cancela pedidos e acompanha o status.
- 🚘 **Automóveis:** registro de matrícula, ano, marca, modelo e placa, com proprietário cliente, empresa ou banco.
- 🏦 **Contrato de crédito:** associação opcional a um banco agente.
- ✅ **Avaliação financeira:** parecer positivo ou negativo do agente sobre cada pedido.
- 📄 **Execução de contrato:** pedidos aprovados viram contrato de aluguel.
- 🔎 **Filtro por status:** cliente e agente podem filtrar os pedidos por situação.
- 🛡️ **Rotas protegidas:** páginas e endpoints restritos por perfil, com sessão JWT.
- 📱 **Interface responsiva:** telas construídas com Material UI seguindo os wireframes.

---

## 🛠 Tecnologias e Bibliotecas

### 💻 Front-end

| Biblioteca / Ferramenta | Versão | Para que é usada |
| :--- | :---: | :--- |
| **React** | 19.3.1 | Biblioteca base da interface. |
| **React DOM** | 19.3.1 | Renderização da aplicação no navegador. |
| **TypeScript** | 7.0.2 | Tipagem estática do código. |
| **Vite** | 8.3.5 | Servidor de desenvolvimento e build de produção. |
| **@vitejs/plugin-react** | 6.1.2 | Suporte ao React no Vite (Fast Refresh/JSX). |
| **MUI (Material UI)** | 9.5.0 | Componentes de interface (`Button`, `TextField`, `Table`, `Dialog`, `Alert`, etc.) e layout. |
| **@emotion/react** | 11.14.0 | Motor de estilos do MUI. |
| **@emotion/styled** | 11.14.1 | Estilização de componentes com MUI/Emotion. |
| **React Router DOM** | 7.18.5 | Roteamento SPA e rotas protegidas por perfil. |
| **Axios** | 1.21.0 | Cliente HTTP para consumo da API, com interceptors de JWT. |
| **oxlint** | 1.89.0 | Lint do código front-end. |
| **Node.js** | 24 (Docker) | Ambiente de build; o Vite 8 requer `^20.19.0` ou `>=22.12.0`. |
| **Nginx** | 1.29 (Alpine) | Servidor dos arquivos estáticos em produção. |

### 🖥️ Back-end

| Biblioteca / Ferramenta | Versão | Para que é usada |
| :--- | :---: | :--- |
| **Java (JDK)** | 25 | Linguagem e runtime da API. |
| **Spring Boot** | 4.1.2 | Framework principal, com arquitetura MVC. |
| **Spring Web MVC** | 4.1.2 | Endpoints REST e serialização JSON. |
| **Spring Data JPA (Hibernate)** | 4.1.2 | Persistência e acesso ao PostgreSQL. |
| **Spring Security** | 4.1.2 | Autenticação, autorização por perfil e BCrypt. |
| **Spring Validation** | 4.1.2 | Validação dos DTOs (Jakarta Bean Validation). |
| **PostgreSQL Driver** | Gerenciado pelo Boot | Conexão JDBC com Supabase/PostgreSQL. |
| **Lombok** | Gerenciado pelo Boot | Redução de boilerplate (getters, construtores, etc.). |
| **JJWT (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`)** | 0.12.6 | Geração e validação dos tokens JWT. |
| **JUnit 5** | Gerenciado pelo Boot | Testes unitários. |
| **Mockito + AssertJ** | Gerenciado pelo Boot | Mocks e asserções nos testes de serviço. |
| **Apache Maven** | 3.10 (wrapper) | Build e gerenciamento de dependências. |

### 🗄️ Banco de dados

* **Supabase** (PostgreSQL) em produção.
* **PostgreSQL 17** (container Alpine) no ambiente local via Docker Compose.
* Tabelas criadas/atualizadas pelo Hibernate (`JPA_DDL_AUTO=update`).

### ⚙️ Infraestrutura e DevOps

* **Docker** e **Docker Compose:** banco, back-end e front-end containerizados.
* **Vercel:** deploy do front-end, com rewrite de SPA em [`frontend/vercel.json`](./frontend/vercel.json).
* **Render:** hospedagem do back-end.
* **GitHub Actions:** workflows para manter o back-end e o Supabase acordados.
* **Git:** versionamento com mensagens no padrão **Conventional Commits**.

---

## 🏗 Arquitetura

O sistema é dividido em dois subsistemas: gestão de pedidos e contratos, e construção dinâmica das páginas web. O back-end segue **MVC** em camadas e expõe uma API REST consumida pelo front-end React.

### Back-end

- **controller:** endpoints REST.
- **service:** regras de negócio (limite de 3 rendimentos, ciclo de vida do pedido, permissões por perfil).
- **repository:** acesso ao Supabase via Spring Data JPA.
- **model:** entidades e enums.
- **dto:** objetos de transferência.
- **security:** filtro JWT, configuração de CORS e autorização.
- **exception:** exceções de domínio e tratamento global de erros (`@RestControllerAdvice`).

Ciclo de vida do pedido: **Em análise → Aprovado ou Reprovado → Contrato executado**, com **Cancelado** possível até a execução do contrato.

### Front-end

- **pages:** telas separadas por perfil (`auth`, `cliente`, `agente` e `compartilhadas`).
- **components:** componentes reutilizáveis (tabelas, formulários, diálogos, status etc.).
- **routes:** rotas públicas/protegidas e redirecionamento por perfil.
- **services:** chamadas à API com Axios e persistência da sessão.
- **hooks:** carregamento de dados e estado das telas.
- **context:** sessão e autenticação do usuário.
- **constants / types / utils / styles:** textos, endpoints, temas MUI, tipagens e funções auxiliares.

A autenticação usa **JWT** enviado no cabeçalho `Authorization: Bearer <token>`. Um interceptor do Axios adiciona o token automaticamente e encerra a sessão em respostas `401`.

### Diagramas

| Diagrama | Arquivo |
| :---: | :---: |
| **Casos de Uso** | [docs/Modelagem do Sistema — Aluguel de Carros.pdf](./docs/Modelagem%20do%20Sistema%20—%20Aluguel%20de%20Carros.pdf) |
| **Classes** | [docs/Modelagem do Sistema — Aluguel de Carros.pdf](./docs/Modelagem%20do%20Sistema%20—%20Aluguel%20de%20Carros.pdf) |
| **Pacotes (Visão Lógica)** | [docs/Modelagem do Sistema — Aluguel de Carros.pdf](./docs/Modelagem%20do%20Sistema%20—%20Aluguel%20de%20Carros.pdf) |
| **Histórias do Usuário** | [docs/Modelagem do Sistema — Aluguel de Carros.pdf](./docs/Modelagem%20do%20Sistema%20—%20Aluguel%20de%20Carros.pdf) |
| **Wireframes** | [docs/wireframes](./docs/wireframes) |

### 🔌 API REST

| Método | Endpoint | Perfil | Descrição |
| :---: | :--- | :---: | :--- |
| `POST` | `/auth/register` | Público | Cadastra um usuário. |
| `POST` | `/auth/login` | Público | Autentica e retorna o token JWT. |
| `GET` | `/clientes/me` | Cliente | Consulta o próprio cadastro. |
| `PUT` | `/clientes/me` | Cliente | Atualiza o próprio cadastro. |
| `DELETE` | `/clientes/me` | Cliente | Exclui a própria conta. |
| `GET` | `/agentes` | Autenticado | Lista empresas/bancos agentes. |
| `POST` | `/pedidos` | Cliente | Cria um pedido de aluguel. |
| `GET` | `/pedidos?status=` | Cliente/Agente | Lista pedidos, com filtro opcional por status. |
| `GET` | `/pedidos/{id}` | Cliente/Agente | Consulta um pedido. |
| `PUT` | `/pedidos/{id}` | Cliente/Agente | Modifica um pedido. |
| `DELETE` | `/pedidos/{id}` | Cliente | Cancela um pedido. |
| `POST` | `/pedidos/{id}/avaliacao` | Agente | Registra o parecer financeiro. |
| `POST` | `/pedidos/{id}/credito` | Agente | Concede o contrato de crédito. |
| `POST` | `/pedidos/{id}/contrato` | Agente | Executa o contrato de aluguel. |

> [!NOTE]
> Todos os endpoints, exceto cadastro e login, exigem um token JWT válido.

---

## 🔧 Instalação e Execução

### Pré-requisitos

* **Java JDK:** versão **25**
* **Maven:** pelo wrapper `./mvnw` incluído no projeto
* **Node.js:** `^20.19.0` ou `>=22.12.0` (exigência do Vite 8); recomendado Node 24 LTS
* **Gerenciador de pacotes:** npm
* **Conta no Supabase** com um projeto criado — ou **Docker** para usar o PostgreSQL local

---

### 🔑 Variáveis de Ambiente

#### Back-end (Spring Boot)

Copie `backend/.env.example` para `backend/.env` e preencha com os dados do seu projeto Supabase.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | URL JDBC do Supabase (PostgreSQL). | `jdbc:postgresql://aws-0-<regiao>.pooler.supabase.com:5432/postgres?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | Usuário do banco. | `postgres.<ref-do-projeto>` |
| `SPRING_DATASOURCE_PASSWORD` | Senha do banco. | `sua-senha-aqui` |
| `JPA_DDL_AUTO` | Estratégia do Hibernate para o schema. | `update` |
| `FRONTEND_URL` | Origem permitida no CORS. | `http://localhost:5173` |
| `JWT_SECRET` | Chave para assinatura dos tokens (mín. 32 caracteres). | `chave_super_segura_base64` |

> Gere um segredo forte com `openssl rand -base64 32`.

#### Front-end (React, Vite)

Crie `frontend/.env` com o prefixo `VITE_`.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base da API. | `http://localhost:8080` |

#### Docker Compose (raiz do projeto)

O arquivo `.env.example` da raiz já traz valores padrão para rodar tudo localmente. Use-o apenas se quiser alterar algo.

| Variável | Descrição | Padrão |
| :--- | :--- | :--- |
| `POSTGRES_DB` | Nome do banco local. | `leocaliza` |
| `POSTGRES_USER` | Usuário do banco local. | `leocaliza` |
| `POSTGRES_PASSWORD` | Senha do banco local. | `leocaliza` |
| `SPRING_DATASOURCE_URL` | URL JDBC usada pelo back-end. | `jdbc:postgresql://db:5432/leocaliza` |
| `SPRING_DATASOURCE_USERNAME` | Usuário JDBC. | `leocaliza` |
| `SPRING_DATASOURCE_PASSWORD` | Senha JDBC. | `leocaliza` |
| `JPA_DDL_AUTO` | Estratégia do Hibernate. | `update` |
| `JWT_SECRET` | Segredo dos tokens JWT. | valor de teste interno |
| `BACKEND_PORT` | Porta do back-end na máquina. | `8080` |
| `FRONTEND_PORT` | Porta do front-end na máquina. | `5173` |
| `FRONTEND_URL` | Origem permitida no CORS. | `http://localhost:5173` |
| `VITE_API_URL` | URL da API usada no build do front-end. | `http://localhost:8080` |

> [!WARNING]
> Nunca versione arquivos `.env`. Apenas os arquivos `.env.example` vão para o repositório.

---

### 📦 Instalação de Dependências

```bash
git clone <URL_DO_REPOSITORIO>
cd LeoCaliza
```

#### Front-end (React)

```bash
cd frontend
npm install
cd ..
```

#### Back-end (Spring Boot)

```bash
cd backend
./mvnw clean install
cd ..
```

---

### 💾 Banco de Dados (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Project Settings > Database**, copie os dados de conexão (Session pooler) e preencha as variáveis `SPRING_DATASOURCE_*`.
3. As tabelas são criadas pelo Hibernate na primeira execução do back-end (`JPA_DDL_AUTO=update`).

> [!TIP]
> Para desenvolvimento local sem Supabase, use o PostgreSQL do Docker Compose — nenhuma configuração extra é necessária.

---

### ⚡ Como Executar a Aplicação

Execute em **dois terminais separados**.

#### Terminal 1: Back-end (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```
🚀 *O back-end estará disponível em **http://localhost:8080**.*

#### Terminal 2: Front-end (React, Vite)

```bash
cd frontend
npm run dev
```
🎨 *O front-end estará disponível em **http://localhost:5173**.*

---

### 🐳 Como Executar com Docker

Na raiz do projeto:

```bash
cp .env.example .env
# edite o .env e defina um JWT_SECRET forte
docker compose up --build
```

| Serviço | Endereço local |
| :--- | :--- |
| **Front-end (Nginx)** | http://localhost:5173 |
| **Back-end (Spring Boot)** | http://localhost:8080 |
| **PostgreSQL** | interno na rede do Compose (`db:5432`) |

Para parar os containers:

```bash
docker compose down
```

Para remover também os dados do banco local:

```bash
docker compose down -v
```

> [!IMPORTANT]
> `VITE_API_URL` é aplicada em tempo de **build** do front-end. Se a API estiver em outro endereço, ajuste essa variável antes de executar `docker compose up --build`.

---

## 🚀 Deploy

| Camada | Plataforma | Observações |
| :--- | :--- | :--- |
| **Front-end** | [Vercel](https://vercel.com) | Build com Vite; `frontend/vercel.json` redireciona rotas da SPA para `index.html`. Configure `VITE_API_URL` com a URL pública da API. |
| **Back-end** | [Render](https://render.com) | Deploy do Spring Boot com as variáveis de ambiente do banco e do JWT. |
| **Banco** | [Supabase](https://supabase.com) | PostgreSQL gerenciado, acessado via Session pooler. |

O workflow [`keep-alive.yml`](./.github/workflows/keep-alive.yml) faz ping periódico no back-end para evitar a suspensão do serviço no Render, e o [`keep-supabase-awake.yml`](./.github/workflows/keep-supabase-awake.yml) mantém o projeto Supabase ativo.

> [!WARNING]
> Em produção, defina `JWT_SECRET`, `SPRING_DATASOURCE_*` e `FRONTEND_URL` nas variáveis do provedor. Não use os valores padrão do Docker Compose.

---

## 📂 Estrutura de Pastas

```
.
├── README.md
├── docker-compose.yml            # 🐳 Banco + back-end + front-end
├── .env.example                  # 🔑 Variáveis do Docker Compose
├── .gitignore
│
├── /docs                         # 📚 Modelagem: casos de uso, histórias, classes, pacotes e wireframes.
│
├── /frontend                     # 📁 Aplicação React + TypeScript + Vite + MUI
│   ├── .env.example
│   ├── Dockerfile                # Build multi-stage (Node 24 + Nginx)
│   ├── nginx.conf                # Fallback de SPA
│   ├── vercel.json               # Rewrite de SPA na Vercel
│   ├── package.json
│   └── /src
│       ├── /components           # 🧱 Componentes reutilizáveis.
│       ├── /constants            # 📌 Endpoints, rotas, textos, status e temas.
│       ├── /context              # 🔐 Sessão e autenticação.
│       ├── /hooks                # 🪝 Hooks de dados e estado.
│       ├── /pages                # 📄 Telas (auth, cliente, agente, compartilhadas).
│       ├── /routes               # 🧭 Rotas públicas/protegidas por perfil.
│       ├── /services             # 🔌 Axios, serviços da API e sessão.
│       ├── /styles               # 🎨 Tema MUI.
│       ├── /types                # 🏷️ Tipagens TypeScript.
│       └── /utils                # 🧰 Formatação, datas e regras auxiliares.
│
├── /backend                      # 📁 Aplicação Spring Boot
│   ├── .env.example
│   ├── Dockerfile                # Build multi-stage (JDK 25 + JRE 25)
│   ├── pom.xml
│   └── /src
│       ├── /main/java/.../
│       │   ├── /controller       # 🎮 Endpoints REST.
│       │   ├── /service          # ⚙️ Regras de negócio.
│       │   ├── /repository       # 🗄️ Acesso a dados (JPA).
│       │   ├── /model            # 🧬 Entidades e enums.
│       │   ├── /dto              # ✉️ Objetos de transferência.
│       │   ├── /security         # 🛡️ JWT, CORS e autorização.
│       │   └── /exception        # 🚨 Exceções e tratamento de erros.
│       └── /test                 # 🧪 Testes JUnit + Mockito.
│
└── /.github/workflows            # 🔁 Keep-alive do Render e do Supabase.
```

---

## 🎥 Demonstração

### 🌐 Aplicação Web

| Tela | Captura de Tela |
| :---: | :---: |
| **Login e Cadastro** | _em breve_ |
| **Meus Pedidos** | _em breve_ |
| **Novo Pedido** | _em breve_ |
| **Status do Pedido** | _em breve_ |
| **Meu Cadastro (CRUD de cliente)** | _em breve_ |
| **Avaliação do Agente** | _em breve_ |

---

## 🧪 Testes

```bash
cd backend
./mvnw test
```

_Os testes usam **JUnit 5**, **Mockito** e **AssertJ** e cobrem as regras de negócio em `ClienteServiceTest` e `PedidoServiceTest`._

Para validar o front-end:

```bash
cd frontend
npm run lint
npm run build
```

---

## 🔗 Documentações utilizadas

* 📖 [Spring Boot](https://docs.spring.io/spring-boot/index.html)
* 📖 [Spring Security](https://docs.spring.io/spring-security/reference/index.html)
* 📖 [Spring Data JPA](https://docs.spring.io/spring-data/jpa/reference/index.html)
* 📖 [React](https://react.dev/reference/react)
* 📖 [TypeScript](https://www.typescriptlang.org/docs/)
* 📖 [Vite](https://vitejs.dev/config/)
* 📖 [MUI (Material UI)](https://mui.com/material-ui/getting-started/)
* 📖 [React Router](https://reactrouter.com/)
* 📖 [Axios](https://axios-http.com/docs/intro)
* 📖 [Supabase](https://supabase.com/docs)
* 📖 [Docker Compose](https://docs.docker.com/compose/)
* 📖 [Vercel](https://vercel.com/docs)
* 📖 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

---

## 👥 Autor

| 👤 Nome | 🖼️ Foto | :octocat: GitHub | 💼 LinkedIn | 📤 E-mail |
|---------|----------|-----------------|-------------|-----------|
| Leonardo Pettersen | <div align="center"><img src="https://github.com/leopettersen.png" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/leopettersen"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/leonardopettersen"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:leonardopettersen465@yahoo.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |

---

## 🤝 Contribuição

1. Faça um `fork` do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3. Faça commit das mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`), seguindo o [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
4. Envie a branch (`git push origin feature/minha-feature`).
5. Abra um **Pull Request**.

---

## 🙏 Agradecimentos

* [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) - Pelo apoio institucional e estrutura acadêmica.
* [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) - Pelos ensinamentos na matéria de Desenvolvimento e Integração de Aplicações Web.

---

## 📄 Licença

Este projeto é distribuído sob a **Licença MIT**.

---

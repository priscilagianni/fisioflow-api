# FisioFlow API

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-blue)](https://expressjs.com/)
[![Cypress](https://img.shields.io/badge/Cypress-14-brightgreen)](https://www.cypress.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#license)

API REST simples para gerenciamento de pacientes e agendamento de atendimentos de fisioterapia.

**Projeto educacional** — dados armazenados em memória (não persistem após reiniciar o servidor).

---

##  Índice

* [Objetivo](#objetivo)
* [Requisitos](#requisitos)
* [Instalação](#instalação)
* [Como usar](#como-usar)
* [Estrutura do projeto](#estrutura-do-projeto)
* [Arquitetura](#arquitetura)
* [API Endpoints](#api-endpoints)
* [Regras de negócio](#regras-de-negócio)
* [Testes](#testes)
* [Troubleshooting](#troubleshooting)
* [Melhorias futuras](#melhorias-futuras)
* [Autor](#autor)
* [Licença](#licença)

---

## Objetivo

Este projeto demonstra:

* Desenvolvimento backend com Node.js e Express
* Organização em camadas (Routes, Controllers, Services)
* Implementação de regras de negócio
* Testes manuais e automatizados com Cypress
* Documentação de API com Swagger (OpenAPI)

---

## Requisitos

* Node.js 18+
* npm 9+

---

## Instalação

```bash
# Clonar repositório
git clone <git clone https://github.com/priscilagianni/fisioflow-api.git>
cd fisioFlow

# Instalar dependências
npm install

# Iniciar servidor
npm start
```

Servidor disponível em:

* [http://localhost:3000](http://localhost:3000)
* Swagger: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## Como usar

```bash
npm start
```

Rodando em modo desenvolvimento.

---

## Estrutura do projeto

```
FisioFlow/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── database/
│   └── utils/
│
├── docs/
│   ├── swagger.yaml
│   ├── QA_TEST_PLAN.md
│   ├── user-stories.md
│   └── data-model.md
│
├── cypress/
│   ├── e2e/
│   │   └── fisioflow.cy.js
│   ├── reports/
│   │   ├── assets/
│   │   ├── mochawesome.html
│   │   └── mochawesome.json
│   └── screenshots/
│
├── postman/
│   └── FisioFlow.postman_collection.json
│
├── .env.example
├── .gitignore
├── cypress.config.js
├── package.json
└── package-lock.json
```

---

## Arquitetura

O projeto segue uma arquitetura em camadas:

* **Routes** → Define endpoints
* **Controllers** → Recebe requisição HTTP
* **Services** → Regras de negócio
* **Database (memory)** → Armazena dados temporariamente

Fluxo:

```
Request → Route → Controller → Service → Response
```

---

## API Endpoints

### Patients

#### Criar paciente

`POST /patients`

```json
{
  "name": "Maria Souza",
  "phone": "(85) 99999-0000",
  "age": 35,
  "diagnosis": "Lower back pain"
}
```

---

#### Listar pacientes

`GET /patients`

---

#### Atualizar paciente

`PATCH /patients/{id}`

---

#### Deletar paciente

`DELETE /patients/{id}`

---

### Appointments

#### Criar agendamento

`POST /appointments`

```json
{
  "patientId": 1,
  "date": "2026-04-24",
  "startTime": "10:00",
  "duration": 60
}
```

---

#### Listar agendamentos

`GET /appointments`

---

#### Por dia

`GET /appointments/day/:date`

---

## Regras de negócio

### Conflito de horário

Não é permitido agendar dois atendimentos no mesmo intervalo de tempo.

Regra:

```
newStart < existingEnd AND newEnd > existingStart
```

Se houver conflito:

```json
{
  "message": "Schedule conflict detected"
}
```

---

## Testes

### Cobertura

* Criar/listar/editar/deletar pacientes
* Validação de campos
* Criar agendamentos
* Conflito de horários
* Listagem por data

### Executar testes

```bash
npm run cy:run
npm run cy:open
```

---

## Troubleshooting

### Porta em uso

```bash
lsof -i :3000
kill -9 <PID>
```

### Cypress não conecta

* Verificar servidor rodando
* Conferir baseURL

---

## Melhorias futuras

* Banco de dados (PostgreSQL ou MongoDB)
* Autenticação JWT
* Implementação de middlewares completos
* Docker
* CI/CD com GitHub Actions
* Testes de contrato

---

## Autor

Priscila Gianni

---

## Licença

MIT

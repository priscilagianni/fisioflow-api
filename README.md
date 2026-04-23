# FisioFlow API

API REST simples para gerenciamento de pacientes e agendamento de atendimentos de fisioterapia.

---

## Objetivo

Este projeto demonstra:

- Desenvolvimento backend com Node.js e Express
- Separação de responsabilidades por camadas (Controller, Service, Routes)
- Regras de negócio para prevenção de conflito de horários
- QA manual e automatizado com Postman e Cypress
- Documentação de API com Swagger (OpenAPI)

---

## Estrutura do projeto

```text
src/
controllers/
database/
routes/
services/
utils/


---

## Requisitos

- Node.js 18+
- npm

---

## Instalação

```bash
npm install

Execução
npm start

Servidor:

http://localhost:3000

Swagger:

http://localhost:3000/api-docs


Endpoints
Pacientes
Criar paciente

POST /patients

{
  "name": "Maria Souza",
  "phone": "(85) 99999-0000",
  "diagnosis": "Postural lower back pain"
}

Regras:

name obrigatório
não pode ser vazio
não pode conter números ou caracteres especiais
phone opcional
phone deve seguir formato (XX) XXXXX-XXXX
Listar pacientes

GET /patients

Retorna todos os pacientes cadastrados.

Deletar paciente

DELETE /patients/{id}

Respostas:

200 → paciente removido com sucesso
404 → paciente não encontrado
Atendimentos
Criar atendimento

POST /appointments

{
  "patientId": 1,
  "date": "2026-04-22",
  "startTime": "10:00",
  "duration": 60
}

Regras:

patientId deve existir
date no formato YYYY-MM-DD
startTime no formato HH:MM
duration deve ser maior que zero

Resposta inclui:

endTime calculado automaticamente
createdAt gerado automaticamente
Listar atendimentos

GET /appointments

Listar atendimentos por dia

GET /appointments/day/:date

Regra crítica do sistema

Não pode existir sobreposição de horários no mesmo dia.

Fórmula de conflito:
newStart < existingEnd AND newEnd > existingStart

Se houver conflito:

{
  "message": "Conflito de horario detectado"
}
Cenários de teste
Pacientes
CT01: Criar paciente com sucesso
CT02: Listar pacientes
CT03: Criar paciente sem nome (erro)
CT12: Remover paciente existente
CT13: Remover paciente inexistente
Atendimentos
CT04: Criar atendimento válido
CT05: Conflito de horário (erro)
CT06: Atendimento válido em horário livre
CT07: Dados faltando (erro)
CT08: Duração zero (erro)
CT09: Paciente inexistente (erro)
CT10: Listar atendimentos
CT11: Listar atendimentos do dia

Documentação
User Stories: docs/user-stories.md
Plano de testes: docs/QA_TEST_PLAN.md
Modelo de dados: docs/data-model.md
Postman

Coleção:

postman/FisioFlow.postman_collection.json
Cypress

Abrir interface:

npm run cy:open

Executar testes:

npm run cy:run


Melhorias futuras
Atualização de pacientes (PATCH/PUT)
Remoção de atendimentos
Regra de integridade entre paciente e atendimentos
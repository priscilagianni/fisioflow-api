# 🧪 QA Test Plan - FisioFlow

Versão: v1.1  
Ambiente: API local em desenvolvimento  
Tipo: Testes funcionais e validação de regras de negócio  

---

## 🎯 Escopo

Validação funcional da API de pacientes e atendimentos:

- Cadastro de pacientes  
- Atualização parcial de pacientes (PATCH)  
- Remoção de pacientes  
- Listagem de pacientes  
- Criação de atendimentos  
- Listagem de atendimentos  
- Controle de agenda  
- Prevenção de conflitos de horário  
- Validação de regras de negócio e integridade de dados  

---

## 🖥️ Ambiente

- API local em execução  
- Base de dados em memória (arrays)  
- Reset automático entre execuções  
- Ferramentas:
  - Postman (testes manuais)
  - Cypress (testes automatizados)

---

# 📋 Casos de Teste

---

# 👤 Pacientes

---

## CT01 - Criar paciente com dados válidos  
Severidade: Crítico | Tipo: Funcional  

**Resultado esperado:**
- Status 201  
- Paciente criado com sucesso  
- Retorna `id` e `createdAt`  

---

## CT02 - Listar pacientes cadastrados  
Severidade: Baixa | Tipo: Funcional  

**Resultado esperado:**
- Status 200  
- Retorna array de pacientes  

---

## CT03 - Criar paciente sem nome  
Severidade: Crítico | Tipo: Validação negativa  

**Resultado esperado:**
- Status 400  
- Mensagem de erro: nome obrigatório  

---

## CT04 - Criar paciente com idade inválida  
Severidade: Crítico | Tipo: Validação de regra  

**Resultado esperado:**
- Status 400  
- Idade fora do intervalo (1 a 120) rejeitada  

---

## CT05 - Criar paciente com telefone inválido  
Severidade: Crítico | Tipo: Validação de formato  

**Resultado esperado:**
- Status 400  
- Mensagem: telefone inválido  

---

## CT06 - Atualizar paciente (PATCH)  
Severidade: Crítico | Tipo: Atualização parcial  

**Resultado esperado:**
- Status 200  
- Atualização parcial realizada corretamente  
- Campos não enviados permanecem inalterados  

---

## CT07 - Excluir paciente existente  
Severidade: Crítico | Tipo: Integração  

**Resultado esperado:**
- Status 200  
- Paciente removido  
- Atendimentos removidos automaticamente (cascata)  

---

## CT08 - Excluir paciente inexistente  
Severidade: Médio | Tipo: Validação negativa  

**Resultado esperado:**
- Status 404  
- Paciente não encontrado  

---

# 📅 Atendimentos

---

## CT09 - Criar atendimento válido  
Severidade: Crítico | Tipo: Funcional  

**Resultado esperado:**
- Status 201  
- Atendimento criado  
- `endTime` calculado automaticamente  

---

## CT10 - Campos obrigatórios ausentes  
Severidade: Crítico | Tipo: Validação negativa  

**Resultado esperado:**
- Status 400  
- Mensagem de campos obrigatórios  

---

## CT11 - Paciente inexistente  
Severidade: Crítico | Tipo: Integração  

**Resultado esperado:**
- Status 404  
- Paciente não encontrado  

---

## CT12 - Conflito de horário  
Severidade: Crítico | Tipo: Regra de negócio  

**Resultado esperado:**
- Status 400  
- Mensagem de conflito de horário  

---

## CT13 - Listar atendimentos  
Severidade: Baixa | Tipo: Funcional  

**Resultado esperado:**
- Status 200  
- Lista de atendimentos válida  

---

## CT14 - Listar atendimentos por data  
Severidade: Baixa | Tipo: Funcional  

**Resultado esperado:**
- Status 200  
- Apenas atendimentos do dia informado  

---

# 📌 Regras de Qualidade

- API utiliza armazenamento em memória (dados são perdidos ao reiniciar)  
- Conflito de horário é regra crítica de negócio  
- Atualização de paciente é parcial (PATCH)  
- Paciente e atendimento possuem relacionamento direto  
- Exclusão de paciente deve limpar atendimentos vinculados  

---

# 📊 Cobertura do Test Plan

✔ CRUD completo de pacientes  
✔ CRUD completo de atendimentos  
✔ Validações negativas e positivas  
✔ Regras de negócio críticas  
✔ Integração entre entidades  
✔ PATCH (atualização parcial)  
✔ Conflito de agenda  
✔ Base pronta para automação com Cypress  
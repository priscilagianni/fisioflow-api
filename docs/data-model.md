# Data Model - FisioFlow

---

## Patient

### Campos

- **id**: identificador numérico gerado automaticamente  
- **name**: nome do paciente  
- **phone**: telefone opcional no formato `(XX) XXXXX-XXXX`  
- **age**: idade do paciente  
- **diagnosis**: diagnóstico opcional  
- **createdAt**: data de criação (ISO 8601)

---

### Regras de validação

- `name` é obrigatório  
- `name` não pode conter números ou caracteres especiais  
- `age` é obrigatória e deve ser um número entre **1 e 120**  
- `phone` é opcional, mas quando informado deve seguir o formato `(XX) XXXXX-XXXX`

---

### Regras de comportamento

- Pacientes podem ser removidos via `DELETE /patients/{id}`  
- Ao remover um paciente, todos os seus atendimentos são removidos automaticamente (exclusão em cascata)  
- Dados são armazenados em memória (arrays)  
- Ao reiniciar a API, todos os dados são perdidos  

---

### Status Codes (Patient)

- **201** → criado com sucesso  
- **200** → operação realizada com sucesso  
- **400** → erro de validação  
- **404** → paciente não encontrado  

---

## Appointment

### Campos

- **id**: identificador numérico gerado automaticamente  
- **patientId**: referência ao paciente  
- **date**: data no formato `YYYY-MM-DD`  
- **startTime**: horário inicial (`HH:MM`)  
- **duration**: duração em minutos  
- **endTime**: calculado automaticamente  
- **createdAt**: data de criação (ISO 8601)

---

### Regras de validação

- `patientId` deve existir no sistema  
- `date`, `startTime` e `duration` são obrigatórios  
- `duration` deve ser um número positivo  
- `startTime` deve seguir o formato `HH:MM`  
- Não pode haver conflito de horário no mesmo dia  

---

### Regras de comportamento

- O `endTime` é calculado automaticamente (`startTime + duration`)  
- Atendimentos são removidos automaticamente quando o paciente é deletado  
- Não é permitido agendar dois atendimentos com sobreposição de horário no mesmo dia  

---

### Regra de conflito de horário

Um novo agendamento entra em conflito quando:

- seu horário inicial ocorre antes do término de outro agendamento  
**E**
- seu horário final ocorre depois do início de outro agendamento  

```text
newStart < existingEnd AND newEnd > existingStart
```

---

### 📡 Status Codes (Appointment)

- **201** → criado com sucesso  
- **200** → operação realizada com sucesso  
- **400** → erro de validação (dados inválidos)  
- **409** → conflito de horário detectado  
- **404** → paciente não encontrado
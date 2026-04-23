const appointmentService = require('../services/appointmentService');

// Criar atendimento
function createAppointment(req, res) {
  try {
    const result = appointmentService.createAppointment(req.body);

    if (result.error) {
      return res.status(result.error.status).json({
        message: result.error.message
      });
    }

    return res.status(201).json(result.data);
  } catch {
    return res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
}

// Listar atendimentos
function listAppointments(req, res) {
  try {
    const data = appointmentService.listAppointments();
    return res.status(200).json(data);
  } catch {
    return res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
}

// Listar por data
function listAppointmentsByDate(req, res) {
  try {
    const data = appointmentService.listAppointmentsByDate(req.params.date);
    return res.status(200).json(data);
  } catch {
    return res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
}

module.exports = {
  createAppointment,
  listAppointments,
  listAppointmentsByDate
};
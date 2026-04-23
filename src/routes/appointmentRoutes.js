const express = require('express');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();

/**
 * @route POST /appointments
 * @description Cria um novo atendimento
 */
router.post('/', appointmentController.createAppointment);

/**
 * @route GET /appointments
 * @description Lista todos os atendimentos
 */
router.get('/', appointmentController.listAppointments);

/**
 * @route GET /appointments/day/:date
 * @description Lista atendimentos por data (YYYY-MM-DD)
 */
router.get('/day/:date', appointmentController.listAppointmentsByDate);

module.exports = router;
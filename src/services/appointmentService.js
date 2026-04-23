const { db, getNextId } = require('../database/inMemoryDatabase');
const { convertTimeToMinutes, convertMinutesToTime } = require('../utils/timeUtils');

function createAppointment(data) {
  const { patientId, date, startTime, duration } = data;

  if (!patientId || !date || !startTime || duration === undefined) {
    return {
      error: {
        status: 400,
        message: 'patientId, date, startTime and duration are required'
      }
    };
  }

  const patientExists = db.patients.some(p => p.id === Number(patientId));

  if (!patientExists) {
    return { error: { status: 404, message: 'Patient not found' } };
  }

  const start = convertTimeToMinutes(startTime);
  const dur = Number(duration);

  if (start === null) {
    return {
      error: {
        status: 400,
        message: 'Invalid time format. Use HH:MM'
      }
    };
  }

  if (!Number.isInteger(dur) || dur <= 0) {
    return {
      error: {
        status: 400,
        message: 'Duration must be greater than zero'
      }
    };
  }

  const newEnd = start + dur;

  const hasConflict = db.appointments.some(a => {
    if (a.date !== date) return false;

    const aStart = convertTimeToMinutes(a.startTime);
    const aEnd = aStart + Number(a.duration);

    return start < aEnd && newEnd > aStart;
  });

  if (hasConflict) {
    return {
      error: {
        status: 400,
        message: 'Schedule conflict detected'
      }
    };
  }

  const appointment = {
    id: getNextId('appointments'),
    patientId: Number(patientId),
    date,
    startTime,
    duration: dur,
    endTime: convertMinutesToTime(newEnd),
    createdAt: new Date().toISOString()
  };

  db.appointments.push(appointment);

  return { data: appointment };
}

function listAppointments() {
  return db.appointments;
}

function listAppointmentsByDate(date) {
  return db.appointments.filter(a => a.date === date);
}

module.exports = {
  createAppointment,
  listAppointments,
  listAppointmentsByDate
};
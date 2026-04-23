const { db, getNextId } = require('../database/inMemoryDatabase');

// ==========================
// VALIDATION HELPERS
// ==========================
function isValidPatientName(name) {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name);
}

function isValidPhone(phone) {
  return /^\(\d{2}\)\s\d{5}-\d{4}$/.test(phone);
}

// ==========================
// CREATE PATIENT
// ==========================
function createPatient(data) {
  if (!data) {
    return { error: { status: 400, message: 'Required fields missing' } };
  }

  const name = data.name?.trim();

  if (!name) {
    return { error: { status: 400, message: 'Patient name is required' } };
  }

  if (!isValidPatientName(name)) {
    return { error: { status: 400, message: 'Invalid patient name' } };
  }

  const age = data.age;

  // required
  if (age === undefined || age === null) {
    return { error: { status: 400, message: 'Patient age is required' } };
  }

  // type validation
  if (typeof age !== 'number') {
    return { error: { status: 400, message: 'Age must be a number' } };
  }

  // business rule
  if (!Number.isInteger(age) || age < 1 || age > 120) {
    return { error: { status: 400, message: 'Invalid age' } };
  }

  // phone validation
  if (data.phone && !isValidPhone(data.phone)) {
    return {
      error: {
        status: 400,
        message: 'Invalid phone format. Use (XX) XXXXX-XXXX'
      }
    };
  }

  const patient = {
    id: getNextId('patients'),
    name,
    phone: data.phone || '',
    age,
    diagnosis: data.diagnosis || '',
    createdAt: new Date().toISOString()
  };

  db.patients.push(patient);

  return { data: patient };
}

// ==========================
// LIST PATIENTS
// ==========================
function listPatients() {
  return db.patients;
}

// ==========================
// DELETE PATIENT (CASCADE)
// ==========================
function deletePatient(id) {
  const index = db.patients.findIndex(p => p.id === Number(id));

  if (index === -1) {
    return { error: { status: 404, message: 'Patient not found' } };
  }

  // remove patient
  db.patients.splice(index, 1);

  // cascade delete appointments
  db.appointments = db.appointments.filter(
    a => a.patientId !== Number(id)
  );

  return {
    data: {
      message: 'Patient deleted successfully'
    }
  };
}

// ==========================
// UPDATE PATIENT (PATCH)
// ==========================
function updatePatient(id, data) {
  const patient = db.patients.find(p => p.id === Number(id));

  if (!patient) {
    return { error: { status: 404, message: 'Patient not found' } };
  }

  // NAME
  if (data.name !== undefined) {
    const name = data.name?.trim();

    if (!name) {
      return { error: { status: 400, message: 'Patient name is required' } };
    }

    if (!isValidPatientName(name)) {
      return { error: { status: 400, message: 'Invalid patient name' } };
    }

    patient.name = name;
  }

  // PHONE
  if (data.phone !== undefined) {
    const phone = data.phone?.trim();

    if (phone && !isValidPhone(phone)) {
      return {
        error: {
          status: 400,
          message: 'Invalid phone format. Use (XX) XXXXX-XXXX'
        }
      };
    }

    patient.phone = phone;
  }

  // AGE
  if (data.age !== undefined) {
    if (typeof data.age !== 'number') {
      return { error: { status: 400, message: 'Age must be a number' } };
    }

    if (!Number.isInteger(data.age) || data.age < 1 || data.age > 120) {
      return { error: { status: 400, message: 'Invalid age' } };
    }

    patient.age = data.age;
  }

  // DIAGNOSIS
  if (data.diagnosis !== undefined) {
    patient.diagnosis = data.diagnosis?.trim();
  }

  return { data: patient };
}

module.exports = {
  createPatient,
  listPatients,
  deletePatient,
  updatePatient
};
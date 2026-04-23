describe('FisioFlow API - Full Test Suite', () => {
  let patientId;

  const baseName = `Patient Cypress Test`;

  function generateTime(offsetMinutes) {
    const baseHour = 8;
    const totalMinutes = baseHour * 60 + offsetMinutes;
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const minutes = String(totalMinutes % 60).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const start1 = generateTime(0);         // 08:00
  const startConflict = generateTime(30);  // 08:30
  const startFree = generateTime(120);     // 10:00

  beforeEach(() => {
    cy.request('DELETE', '/test/reset');

    cy.request('POST', '/patients', {
      name: baseName,
      phone: '(85) 98888-7777',
      age: 30,
      diagnosis: 'Setup'
    }).then((res) => {
      patientId = res.body.id;
    });
  });

  // =========================
  // US01 - CREATE PATIENT
  // =========================

  it('US01 - should create patient successfully', () => {
    cy.request('POST', '/patients', {
      name: 'Maria Souza',
      phone: '(85) 99999-0000',
      age: 35,
      diagnosis: 'Pain'
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.id).to.exist;
    });
  });

  it('US01 - should fail when name is missing', () => {
    cy.request({ method: 'POST', url: '/patients', failOnStatusCode: false, body: { age: 20 } })
      .then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Patient name is required');
      });
  });

  it('US01 - should fail when name has numbers', () => {
    cy.request({
      method: 'POST',
      url: '/patients',
      failOnStatusCode: false,
      body: { name: '123', age: 20 }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.eq('Invalid patient name');
    });
  });

  it('US01 - should fail when age is missing', () => {
    cy.request({
      method: 'POST',
      url: '/patients',
      failOnStatusCode: false,
      body: { name: 'Maria' }
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });

  it('US01 - should fail when age < 1', () => {
    cy.request({
      method: 'POST',
      url: '/patients',
      failOnStatusCode: false,
      body: { name: 'Maria', age: 0 }
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });

  it('US01 - should fail when age > 120', () => {
    cy.request({
      method: 'POST',
      url: '/patients',
      failOnStatusCode: false,
      body: { name: 'Maria', age: 121 }
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });

  it('US01 - should fail invalid phone format', () => {
    cy.request({
      method: 'POST',
      url: '/patients',
      failOnStatusCode: false,
      body: { name: 'Maria', age: 30, phone: '859999' }
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });

  // =========================
  // US02 - LIST PATIENTS
  // =========================

  it('US02 - should list patients', () => {
    cy.request('GET', '/patients').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  // =========================
  // US03 - PATCH PATIENT
  // =========================

  it('US03 - update name only', () => {
    cy.request('PATCH', `/patients/${patientId}`, {
      name: 'Updated Name'
    }).then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it('US03 - update age only', () => {
    cy.request('PATCH', `/patients/${patientId}`, {
      age: 40
    }).then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it('US03 - update phone only', () => {
    cy.request('PATCH', `/patients/${patientId}`, {
      phone: '(85) 97777-0000'
    }).then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it('US03 - invalid age string', () => {
    cy.request({
      method: 'PATCH',
      url: `/patients/${patientId}`,
      failOnStatusCode: false,
      body: { age: 'abc' }
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });

  it('US03 - patient not found', () => {
    cy.request({
      method: 'PATCH',
      url: '/patients/999999',
      failOnStatusCode: false,
      body: { name: 'Test' }
    }).then((res) => {
      expect(res.status).to.eq(404);
    });
  });

  // =========================
  // US04 - DELETE PATIENT
  // =========================

  it('US04 - delete patient', () => {
    cy.request('DELETE', `/patients/${patientId}`).then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it('US04 - delete invalid patient', () => {
    cy.request({
      method: 'DELETE',
      url: '/patients/999999',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(404);
    });
  });

  // =========================
  // US05 - APPOINTMENTS
  // =========================

  it('US05 - create appointment', () => {
    cy.request('POST', '/appointments', {
      patientId,
      date: '2026-04-22',
      startTime: start1,
      duration: 60
    }).then((res) => {
      expect(res.status).to.eq(201);
    });
  });

  it('US05 - missing fields', () => {
    cy.request({
      method: 'POST',
      url: '/appointments',
      failOnStatusCode: false,
      body: {}
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });

  // =========================
  // US06 - CONFLICT
  // =========================

  it('US06 - should detect conflict', () => {
    cy.request('POST', '/appointments', {
      patientId,
      date: '2026-04-22',
      startTime: start1,
      duration: 60
    }).then(() => {

      cy.request({
        method: 'POST',
        url: '/appointments',
        failOnStatusCode: false,
        body: {
          patientId,
          date: '2026-04-22',
          startTime: startConflict,
          duration: 60
        }
      }).then((res) => {
        expect(res.status).to.eq(400);
      });

    });
  });

  it('US06 - no conflict allowed', () => {
    cy.request('POST', '/appointments', {
      patientId,
      date: '2026-04-22',
      startTime: startFree,
      duration: 30
    }).then((res) => {
      expect(res.status).to.eq(201);
    });
  });

  // =========================
  // US07 - APPOINTMENTS BY DAY
  // =========================

  it('US07 - list appointments by day', () => {
    cy.request('GET', '/appointments/day/2026-04-22').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

});
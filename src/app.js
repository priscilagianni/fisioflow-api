const express = require('express');
const path = require('path');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const { db, resetDatabase } = require('./database/inMemoryDatabase');

const app = express();

const swaggerDocument = YAML.load(
  path.join(__dirname, '..', 'docs', 'swagger.yaml')
);

app.use(express.json());

// HOME
app.get('/', (req, res) => {
  res.json({
    name: 'FisioFlow API',
    status: 'online'
  });
});

// SWAGGER
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ROUTES
app.use('/patients', patientRoutes);
app.use('/appointments', appointmentRoutes);

// RESET (TEST ONLY)
app.delete('/test/reset', (req, res) => {
  resetDatabase();

  return res.status(200).json({
    message: 'Banco resetado com sucesso'
  });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor'
  });
});

module.exports = app;
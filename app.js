const express = require('express');
const cors = require('cors');
const indexRouter = require('./routes/index');

const app = express();

// Habilitar CORS para todas las rutas
app.use(cors());

// Configurar la aplicación para manejar JSON
app.use(express.json());

// Configurar las rutas
app.use('/', indexRouter);

module.exports = app;
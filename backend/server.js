// backend/server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const tasksRouter = require('./routes/tasks');
const sendMailRoute = require('./routes/sendMail');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/send-mail', sendMailRoute);
app.use('/api/auth', authRoutes);

// Inicialização
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

require('./cron/emailScheduler');

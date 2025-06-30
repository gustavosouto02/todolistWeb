// backend/cron/emailScheduler.js
const cron = require('node-cron');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const sendPendingTasks = require('../utils/mailer');
const Task = require('../models/task');

const dbPath = path.resolve(__dirname, '../../database/db.sqlite');
const db = new sqlite3.Database(dbPath);
const logPath = path.resolve(__dirname, '../../logs/email-log.txt');

// Garante que o diretório logs exista
const logDir = path.dirname(logPath);
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

function appendLog(text) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${text}\n`);
}

// Executa a cada minuto (para testes)
cron.schedule('*/1 * * * *', () => {
  console.log('⏰ Verificando tarefas pendentes para todos os usuários...\n');
  appendLog('⏰ Verificando tarefas pendentes...');

  db.all('SELECT id, name, email FROM users', [], (err, users) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      appendLog(`Erro ao buscar usuários: ${err}`);
      return;
    }

    users.forEach(user => {
      Task.getAllByUser(user.id, (err, tasks) => {
        if (err) {
          console.error('Erro ao buscar tarefas:', err);
          appendLog(`Erro ao buscar tarefas de ${user.email}: ${err}`);
          return;
        }

        const pendentes = tasks.filter(t => t.completed === 0);

        if (pendentes.length === 0) {
          const msg = `✅ Usuário ${user.name || user.email} está com tudo em dia!`;
          console.log(msg + '\n');
          appendLog(msg);
        } else {
          const msg = `📧 Usuário ${user.name || user.email} possui ${pendentes.length} tarefas pendentes. Email enviado.`;
          console.log(msg);
          appendLog(msg);
          sendPendingTasks(user.id, user.name);
        }
      });
    });
  });
});
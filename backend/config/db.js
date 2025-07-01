const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.resolve(__dirname, '../database');
const dbPath = path.join(dbDir, 'database.sqlite');

// Garante que o diretório exista
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar no banco de dados:', err.message);
  } else {
    console.log('🗄 Banco de dados conectado com sucesso');
  }
});

module.exports = db;

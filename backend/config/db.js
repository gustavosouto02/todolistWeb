// backend/config/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, '../database.sqlite'), (err) => {
  if (err) {
    console.error('Erro ao conectar no banco de dados:', err.message);
  } else {
    console.log('🗄 Banco de dados conectado com sucesso');
  }
});

module.exports = db;

// backend/models/User.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, '../../database/db.sqlite');
const db = new sqlite3.Database(dbPath);

// Criação da tabela de usuários
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);
});

const User = {
  create: (name, email, password, callback) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return callback(err);
      const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      db.run(query, [name, email, hash], function (err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID, name, email });
      });
    });
  },

  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.get(query, [email], (err, row) => {
      if (err) return callback(err);
      callback(null, row);
    });
  },

  findById: (id, callback) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.get(query, [id], (err, row) => {
      if (err) return callback(err);
      callback(null, row);
    });
  }
};

module.exports = User;

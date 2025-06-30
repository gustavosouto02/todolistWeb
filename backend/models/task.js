// backend/models/Task.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database/db.sqlite');
const db = new sqlite3.Database(dbPath);

// Criação da tabela se não existir
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

const Task = {
  getAllByUser(userId, callback) {
    db.all('SELECT * FROM tasks WHERE user_id = ?', [userId], callback);
  },

  create(title, userId, callback) {
    const stmt = 'INSERT INTO tasks (title, user_id) VALUES (?, ?)';
    db.run(stmt, [title, userId], function (err) {
      callback(err, { id: this.lastID, title, completed: 0 });
    });
  },

  update(id, userId, completed, callback) {
    const stmt = 'UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?';
    db.run(stmt, [completed ? 1 : 0, id, userId], callback);
  },

  delete(id, userId, callback) {
    const stmt = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
    db.run(stmt, [id, userId], callback);
  }
};

module.exports = Task;
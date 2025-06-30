// backend/models/Task.js
const db = require('../config/db');

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

    update(id, userId, { title, completed }, callback) {
        db.get('SELECT title FROM tasks WHERE id = ? AND user_id = ?', [id, userId], (err, row) => {
            if (err) return callback(err);

            const finalTitle = title !== undefined ? title : row.title;
            const stmt = 'UPDATE tasks SET title = ?, completed = ? WHERE id = ? AND user_id = ?';
            db.run(stmt, [finalTitle, completed ? 1 : 0, id, userId], callback);
        });
    },


    delete(id, userId, callback) {
        const stmt = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
        db.run(stmt, [id, userId], callback);
    },

    findById(id, userId, callback) {
        db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId], callback);
    }
};

module.exports = Task;

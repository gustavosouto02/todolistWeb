// backend/controllers/taskController.js
const Task = require('../models/task');
const db = require('../config/db');

exports.getAllTasks = (req, res) => {
  const userId = req.userId;
  Task.getAllByUser(userId, (err, tasks) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(tasks);
  });
};

exports.createTask = (req, res) => {
  const userId = req.userId;
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Título é obrigatório' });

  Task.create(title, userId, (err, newTask) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newTask);
  });
};

exports.updateTask = (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const { title, completed } = req.body;

  Task.update(id, userId, { title, completed }, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Tarefa atualizada com sucesso' });
  });
};

exports.deleteTask = (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  Task.delete(id, userId, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Tarefa excluída com sucesso' });
  });
};

exports.getTaskById = (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  Task.findById(id, userId, (err, row) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar tarefa' });
    if (!row) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json(row);
  });
};

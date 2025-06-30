// backend/routes/tasks.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticateToken = require('../middlewares/authMiddleware');

// Rotas protegidas por autenticação
router.get('/', authenticateToken, taskController.getAllTasks);
router.post('/', authenticateToken, taskController.createTask);
router.put('/:id', authenticateToken, taskController.updateTask);
router.delete('/:id', authenticateToken, taskController.deleteTask);

module.exports = router;

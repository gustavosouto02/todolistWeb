// backend/routes/sendMail.js
const express = require('express');
const router = express.Router();
const sendPendingTasks = require('../utils/mailer');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, (req, res) => {
  const userId = req.userId;
  sendPendingTasks(userId);
  res.json({ message: 'Tentativa de envio de tarefas pendentes iniciada.' });
});

module.exports = router;

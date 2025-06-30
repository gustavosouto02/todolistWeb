// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const SECRET = 'segredo_super_secreto'; 

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  User.create(name, email, password, (err, newUser) => {
    if (err) return res.status(500).json({ error: 'Erro ao registrar usuário ou email já em uso' });
    res.status(201).json({ message: 'Usuário registrado com sucesso', user: newUser });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

  User.findByEmail(email, (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Credenciais inválidas' });

    bcrypt.compare(password, user.password, (err, match) => {
      if (err || !match) return res.status(401).json({ error: 'Credenciais inválidas' });

      const token = jwt.sign({ id: user.id, name: user.name }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login bem-sucedido', token, name: user.name });
    });
  });
};
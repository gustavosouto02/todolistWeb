// backend/utils/mailer.js
const nodemailer = require('nodemailer');
const Task = require('../models/task');
const User = require('../models/User');

async function sendPendingTasks(userId, userName = '') {
    try {
        const user = await new Promise((resolve, reject) => {
            User.findById(userId, (err, user) => (err || !user) ? reject(err || 'Usuário não encontrado') : resolve(user));
        });

        const tasks = await new Promise((resolve, reject) => {
            Task.getAllByUser(userId, (err, tasks) => err ? reject(err) : resolve(tasks));
        });

        const pendentes = tasks.filter(t => t.completed === 0);
        if (pendentes.length === 0) return;

        const lista = pendentes.map(t => `• ${t.title}`).join('\n');
        const saudacao = userName ? `Olá, ${userName}!\n\n` : '';

        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });

        const mailOptions = {
            from: 'TODO LIST <todo@example.com>',
            to: user.email,
            subject: 'Tarefas Pendentes - TODO LIST',
            text: `${saudacao}Você ainda tem as seguintes tarefas pendentes:\n\n${lista}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`👤 Usuário: ${user.name}`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`📝 Tarefas pendentes: ${pendentes.length}`);
        console.log(`✅ Status: E-mail enviado com sucesso`);
        console.log(`🔗 Preview: ${nodemailer.getTestMessageUrl(info)}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
}

module.exports = sendPendingTasks;
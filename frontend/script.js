// frontend/script.js
const API_URL = 'http://localhost:3000/api/tasks';
const SEND_MAIL_URL = 'http://localhost:3000/api/send-mail';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const sendMailBtn = document.getElementById('send-mail-btn');
const logoutBtn = document.getElementById('logout');

window.onload = () => {
    const name = localStorage.getItem('userName') || '';
    document.getElementById('welcome-text').textContent = name ? `Bem-vindo, ${name}!` : '';

    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
    } else {
        fetchTasks();
    }
};

taskForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (title === '') return;
    await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ title })
    });
    taskInput.value = '';
    fetchTasks();
});

sendMailBtn?.addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  if (!token) return alert('Você precisa estar logado.');

  const res = await fetch('http://localhost:3000/api/send-mail', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  const data = await res.json();
  alert(data.message || 'Erro ao enviar e-mail');
});


logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        const span = document.createElement('span');
        span.textContent = task.title;
        const actions = document.createElement('div');
        actions.className = 'actions';
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = task.completed ? 'Desfazer' : 'Concluir';
        toggleBtn.className = 'complete';
        toggleBtn.onclick = () => toggleTask(task.id, !task.completed);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.onclick = () => deleteTask(task.id);
        actions.appendChild(toggleBtn);
        actions.appendChild(deleteBtn);
        li.appendChild(span);
        li.appendChild(actions);
        taskList.appendChild(li);
    });
}

async function fetchTasks() {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch(API_URL, {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    const tasks = await res.json();
    renderTasks(tasks);
}

async function toggleTask(id, completed) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ completed })
    });
    fetchTasks();
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    fetchTasks();
}

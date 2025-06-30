document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    const welcomeEl = document.getElementById('welcome-text');
    const taskList = document.getElementById('task-list');
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const sendMailBtn = document.getElementById('send-mail-btn');
    const emptyMessage = document.getElementById('empty-message');

    welcomeEl.textContent = name ? `Bem-vindo, ${name}!` : 'Bem-vindo!';

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    async function fetchTasks() {
        const res = await fetch('http://localhost:3000/api/tasks', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const tasks = await res.json();

        taskList.innerHTML = ''; // Limpa tudo

        const pendentes = tasks.filter(t => !t.completed);
        const concluidas = tasks.filter(t => t.completed);

        const sectionPending = document.createElement('div');
        const sectionCompleted = document.createElement('div');

        if (pendentes.length) {
            const title = document.createElement('h3');
            title.textContent = '🕓 Tarefas pendentes';
            title.style.marginBottom = '10px';
            sectionPending.appendChild(title);

            pendentes.forEach(t => sectionPending.appendChild(renderTaskElement(t)));
        }

        if (concluidas.length) {
            const title = document.createElement('h3');
            title.textContent = '✅ Tarefas concluídas';
            title.style.margin = '30px 0 10px';
            sectionCompleted.appendChild(title);

            concluidas.forEach(t => sectionCompleted.appendChild(renderTaskElement(t)));
        }

        taskList.appendChild(sectionPending);
        taskList.appendChild(sectionCompleted);

        toggleEmptyMessage();
    }


    function toggleEmptyMessage() {
        const allItems = taskList.querySelectorAll('li');
        emptyMessage.style.display = allItems.length ? 'none' : 'block';
    }


    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = taskInput.value.trim();
        if (!title) return;
        await fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });
        taskInput.value = '';
        fetchTasks();
    });

    sendMailBtn?.addEventListener('click', async () => {
        const res = await fetch('http://localhost:3000/api/send-mail', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        alert(data.message || 'Erro ao enviar e-mail');
    });

    function renderTaskElement(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        if (task.completed) li.classList.add('completed');

        const span = document.createElement('span');
        span.textContent = task.title;

        const actions = document.createElement('div');
        actions.classList.add('actions');

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = task.completed ? 'Desfazer' : 'Concluir';
        toggleBtn.className = 'complete';
        toggleBtn.onclick = () => toggleComplete(task.id, !task.completed);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.className = 'edit';
        editBtn.onclick = () => startEditTask(li, task);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.className = 'delete';
        deleteBtn.onclick = () => deleteTask(task.id);

        actions.append(toggleBtn, editBtn, deleteBtn);
        li.append(span, actions);
        return li;
    }


    async function toggleComplete(id, completed) {
        await fetch(`http://localhost:3000/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });
        fetchTasks();
    }

    async function deleteTask(id) {
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
        await fetch(`http://localhost:3000/api/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchTasks();
    }

    function startEditTask(li, task) {
        const input = document.createElement('input');
        input.value = task.title;
        input.className = 'edit-input';

        // ⌨️ Salvar ao pressionar Enter
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit(task.id, input.value);
            }
        });

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Salvar';
        saveBtn.className = 'edit';
        saveBtn.onclick = () => saveEdit(task.id, input.value);

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancelar';
        cancelBtn.className = 'delete';
        cancelBtn.onclick = fetchTasks;

        li.innerHTML = '';
        li.appendChild(input);

        const actionDiv = document.createElement('div');
        actionDiv.className = 'actions';
        actionDiv.append(saveBtn, cancelBtn);
        li.appendChild(actionDiv);

        input.focus(); // foca automaticamente no campo de edição
    }


    async function saveEdit(id, title) {
        if (!title.trim()) return;

        // Buscar estado atual da tarefa
        const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            alert('Erro ao buscar tarefa para editar');
            return;
        }

        const task = await res.json();

        await fetch(`http://localhost:3000/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, completed: task.completed })
        });

        fetchTasks();
    }


    fetchTasks();
});

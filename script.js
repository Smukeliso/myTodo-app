document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const dateInput = document.getElementById('todo-date');
    const list = document.getElementById('todo-list');

    form.onsubmit = function (e) {
        e.preventDefault();
        if (input.value.trim() !== '' && dateInput.value !== '') {
            addTask(input.value, dateInput.value);
            input.value = '';
            dateInput.value = '';
        }
    };

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach(task => {
            const li = createTaskElement(task);
            list.appendChild(li);
        });
    }

    function addTask(text, dueDate) {
        const taskId = Date.now();
        const task = { id: taskId, text, dueDate, completed: false };
        const li = createTaskElement(task);
        list.appendChild(li);
        saveTask(task);
    }

    function saveTask(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        li.innerHTML = `
            <input type="checkbox" class="toggle-completed" ${task.completed ? 'checked' : ''}>
            <span class="${task.completed ? 'done' : ''}">${task.text} (Due: ${task.dueDate})</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        li.querySelector('.delete-btn').onclick = function () {
            li.remove();
            deleteTask(task.id);
        };
        li.querySelector('.edit-btn').onclick = function () {
            editTask(li, task);
        };
        li.querySelector('.toggle-completed').onchange = function () {
            toggleCompleted(task.id, this.checked);
            li.querySelector('span').classList.toggle('done', this.checked);
        };
        return li;
    }

    function deleteTask(id) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const filteredTasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    }

    function editTask(li, task) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = task.text;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.className = 'save-btn';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'cancel-btn';

        li.innerHTML = '';
        li.append(input, saveBtn, cancelBtn);

        saveBtn.onclick = function () {
            updateTask(task.id, input.value, task.dueDate);
            li.replaceWith(createTaskElement({...task, text: input.value}));
        };

        cancelBtn.onclick = function () {
            li.replaceWith(createTaskElement(task));
        };
    }

    function updateTask(id, newText, dueDate) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const task = tasks.find(task => task.id === id);
        task.text = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function toggleCompleted(id, completed) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const task = tasks.find(task => task.id === id);
        task.completed = completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    loadTasks();
});

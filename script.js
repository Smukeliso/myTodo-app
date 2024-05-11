document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const dateInput = document.getElementById('todo-date');
    const list = document.getElementById('todo-list');
    const errorDisplay = document.createElement('div');  // Create a div for displaying errors
    errorDisplay.className = 'error-message';
    form.appendChild(errorDisplay);

    form.onsubmit = function (e) {
        e.preventDefault();
        const dueDate = new Date(dateInput.value);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);  // Normalize current date to remove time part

        if (input.value.trim() === '' || dateInput.value === '') {
            errorDisplay.textContent = 'Please fill in all fields';
            return;
        }

        if (dueDate < currentDate) {
            errorDisplay.textContent = 'Due date cannot be in the past';
            return;
        } else {
            errorDisplay.textContent = '';  // Clear any previous error messages
            addTask(input.value, dateInput.value);
            input.value = '';
            dateInput.value = '';
        }
    };

    function addTask(text, dueDate) {
        const taskId = Date.now();
        const task = { id: taskId, text, dueDate, completed: false };
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push(task);
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(); // Redraw the tasks list
    }

    function renderTasks() {
        list.innerHTML = ''; // Clear existing tasks
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach(task => {
            const li = createTaskElement(task);
            list.appendChild(li);
        });
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

    // Rest of your functions unchanged...
    function loadTasks() {
        const tasksJson = localStorage.getItem('tasks');
        if (tasksJson) {
            const tasks = JSON.parse(tasksJson);
            tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Ensure sorted even after reload
            tasks.forEach(task => {
                const li = createTaskElement(task);
                list.appendChild(li);
            });
        } else {
            console.log("No tasks found in localStorage."); // Just for debug, can be removed later
        }
    }

    function editTask(li, task) {
        // Create elements for editing
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.className = 'edit-input';
    
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = task.dueDate;
        dateInput.className = 'edit-date-input';
    
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.className = 'save-btn';
    
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'cancel-btn';
    
        // Replace existing list item contents with edit inputs and buttons
        li.innerHTML = '';
        li.append(input, dateInput, saveBtn, cancelBtn);
    
        saveBtn.onclick = function () {
            const newText = input.value.trim();
            const newDueDate = dateInput.value;
            if (newText && newDueDate) {
                updateTask(task.id, newText, newDueDate);
                li.replaceWith(createTaskElement({ ...task, text: newText, dueDate: newDueDate }));
            }
        };
    
        cancelBtn.onclick = function () {
            li.replaceWith(createTaskElement(task));
        };
    }
    
    function updateTask(id, newText, newDueDate) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const index = tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            tasks[index].text = newText;
            tasks[index].dueDate = newDueDate;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks(); // Redraw the tasks list after an update
        }
    }

    function toggleCompleted(taskId, isCompleted) {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = isCompleted; // Update the completed status
            localStorage.setItem('tasks', JSON.stringify(tasks)); // Save updated tasks back to localStorage
        }
    }
    
    

    loadTasks();
});

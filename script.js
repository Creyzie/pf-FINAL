
    let tasks = [];

    const taskInput = document.getElementById('taskInput');
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from localStorage
    function loadTasks() {
        const saved = localStorage.getItem('tasks');
        if (saved) {
            tasks = JSON.parse(saved);
        }
    }

    function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    }

    function renderTasks() {
        
        taskList.innerHTML = '';

        
        if (tasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'No tasks available';
            emptyMessage.className = 'empty-state';
            taskList.appendChild(emptyMessage);
            return;
        }

        
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';

            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            taskText.className = 'task-text';

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-btn';
            editButton.dataset.index = index;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-btn';
            deleteButton.dataset.index = index;

            li.appendChild(taskText);
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            taskList.appendChild(li);
        });
    }

    function editTask(index) {
        const currentText = tasks[index]?.text;
        if (!currentText) return;

        const newText = prompt('Edit task:', currentText);
        if (newText === null) return;

        const trimmedText = newText.trim();
        if (trimmedText === '') return;

        tasks[index].text = trimmedText;
        saveTasks();
        renderTasks();
    }


    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        tasks.push({ text: taskText, completed: false });
        taskInput.value = '';
        renderTasks();
        saveTasks();
    }


    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks();
        saveTasks();
    }


    function toggleCompleted(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }


    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const index = parseInt(e.target.dataset.index);
            editTask(index);
        } else if (e.target.classList.contains('delete-btn')) {
            const index = parseInt(e.target.dataset.index);
            deleteTask(index);
        } else if (e.target.classList.contains('task-text') || e.target.tagName === 'LI') {
            
            let li = e.target;
            if (e.target.classList.contains('task-text')) {
                li = e.target.parentElement;
            }
            const index = Array.from(taskList.children).indexOf(li);
            if (index >= 0 && tasks[index]) {
                toggleCompleted(index);
            }
        }
    });


    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
    });


    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });
    loadTasks();

    renderTasks();


    // --- State & DOM References ---
    // Application state
    let tasks = [];

    // DOM elements used throughout the app
    const taskInput = document.getElementById('taskInput');
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    const filterCategory = document.getElementById('filterCategory');
    const messageBox = document.getElementById('message');

    // UI state
    let searchQuery = '';
    let selectedCategoryFilter = 'All';
    const defaultCategories = ['Personal', 'School', 'Work'];
    let categories = [...defaultCategories];

    // Persistence: Save to localStorage 
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Persistence: Load from localStorage
    function loadTasks() {
        const saved = localStorage.getItem('tasks');
        if (saved) {
            tasks = JSON.parse(saved);
        }
    }

    async function fetchCategories() {
       
        return [...defaultCategories];
    }

    // Categories: populate dropdowns
    function populateCategoryOptions() {
        categorySelect.innerHTML = categories
            .map((category) => `<option value="${category}">${category}</option>`)
            .join('');

        filterCategory.innerHTML = ['All', ...categories]
            .map((category) => `<option value="${category}">${category}</option>`)
            .join('');
    }

    //Notifications (showMessage)
    function showMessage(message, type = 'info') {
        messageBox.textContent = message;
        messageBox.className = `notification ${type}`;
        messageBox.classList.remove('hidden');
        clearTimeout(showMessage.timeoutId);
        showMessage.timeoutId = setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    }

    //  Initialize categories
    async function initCategories() {
        categories = await fetchCategories();
        populateCategoryOptions();
    }

    function renderTasks() {
        
        taskList.innerHTML = '';

        const filteredTasks = tasks
            .map((task, index) => ({ task, index }))
            .filter(({ task }) => {
                const defaultCategory = categories[0] || 'Personal';
                const taskCategory = task.category || defaultCategory;
                const matchesSearch = task.text.toLowerCase().includes(searchQuery);
                const matchesCategory = selectedCategoryFilter === 'All' || taskCategory === selectedCategoryFilter;
                return matchesSearch && matchesCategory;
            });

        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = searchQuery || selectedCategoryFilter !== 'All'
                ? 'No tasks match your filters'
                : 'No tasks available';
            emptyMessage.className = 'empty-state';
            taskList.appendChild(emptyMessage);
            return;
        }

        filteredTasks.forEach(({ task, index }) => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';

            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            taskText.className = 'task-text';

            const categoryBadge = document.createElement('span');
            categoryBadge.textContent = task.category || categories[0] || 'Personal';
            categoryBadge.className = 'task-category';

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-btn';
            editButton.dataset.index = index;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-btn';
            deleteButton.dataset.index = index;

            li.dataset.index = index;
            li.appendChild(taskText);
            li.appendChild(categoryBadge);
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

        tasks.push({
            text: taskText,
            completed: false,
            category: categorySelect.value || categories[0] || 'Personal',
        });
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


    function debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    }

    const handleSearch = debounce((value) => {
        searchQuery = value.trim().toLowerCase();
        renderTasks();
    }, 300);

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
            const index = parseInt(li.dataset.index, 10);
            if (!Number.isNaN(index) && tasks[index]) {
                toggleCompleted(index);
            }
        }
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
    });

    searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });

    filterCategory.addEventListener('change', (e) => {
        selectedCategoryFilter = e.target.value;
        renderTasks();
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    loadTasks();
    initCategories();

    renderTasks();

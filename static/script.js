const addBtn = document.getElementById("add-btn");
const taskInput = document.getElementById("task-input");
const taskContainer = document.getElementById("task-container");
const emptyMsg = document.getElementById("empty-msg");
const suggestionContainer = document.getElementById("suggestion-container");
const suggestionItems = document.getElementById("suggestion-items");

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function updateTaskBoxVisibility() {
    if (taskContainer.children.length > 0) {
        taskContainer.style.display = "block";
        emptyMsg.style.display = "none";
    } else {
        taskContainer.style.display = "none";
        emptyMsg.style.display = "block";
    }
}

function createTaskElement(taskText, priority) {
    const taskEl = document.createElement("div");
    taskEl.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";

    const taskSpan = document.createElement("span");
    taskSpan.className = "task-text";
    taskSpan.textContent = taskText;

    const priorityBadge = document.createElement("span");
    priorityBadge.className = `priority-badge priority-${priority.toLowerCase()}`;
    priorityBadge.textContent = priority;

    taskEl.appendChild(checkbox);
    taskEl.appendChild(taskSpan);
    taskEl.appendChild(priorityBadge);
    taskContainer.appendChild(taskEl);

    checkbox.addEventListener("change", () => {
        taskSpan.classList.add("completed");
        taskEl.classList.add("fade-out");

        const taskIndex = tasks.findIndex(t => t.text === taskText);
        if (taskIndex > -1) {
            tasks.splice(taskIndex, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        setTimeout(() => {
            taskEl.remove();
            updateTaskBoxVisibility();
        }, 500);
    });
}

async function addTask(taskText, showSuggestions = true) {
    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ task: taskText })
        });

        const data = await response.json();
        const priority = data.priority || "Medium";

        const task = {
            text: taskText,
            priority: priority
        };

        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        createTaskElement(taskText, priority);
        taskInput.value = "";
        updateTaskBoxVisibility();
        
        // Only get suggestions for manually added tasks, not clicked suggestions
        if (showSuggestions) {
            getSuggestions(taskText);
        }
    } catch (error) {
        console.error("Error getting priority from server:", error);
        alert("Failed to classify task. Please check if Flask server is running.");
    }
}

async function getSuggestions(taskText) {
    try {
        const response = await fetch("http://127.0.0.1:5000/suggest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ task: taskText })
        });

        const data = await response.json();
        displaySuggestions(data.suggestions || []);
    } catch (error) {
        console.error("Error getting suggestions:", error);
    }
}

function displaySuggestions(suggestions) {
    suggestionItems.innerHTML = '';
    
    if (suggestions.length === 0) {
        suggestionContainer.style.display = 'none';
        return;
    }
    
    suggestions.forEach(suggestion => {
        const suggestionEl = document.createElement('div');
        suggestionEl.className = 'suggestion-item';
        suggestionEl.textContent = suggestion;
        
        suggestionEl.addEventListener('click', () => {
            addTask(suggestion, false);
            suggestionContainer.style.display = 'none';
        });
        
        suggestionItems.appendChild(suggestionEl);
    });
    
    suggestionContainer.style.display = 'block';
}

function loadTasks() {
    taskContainer.innerHTML = '';
    tasks.forEach(task => {
        createTaskElement(task.text, task.priority || "Medium");
    });
    updateTaskBoxVisibility();
}

addBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }
    addTask(taskText);
});

document.addEventListener('DOMContentLoaded', loadTasks);

taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addBtn.click();
    }
});
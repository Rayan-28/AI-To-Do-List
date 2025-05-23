// At the beginning of your script
const addBtn = document.getElementById("add-btn");
const taskInput = document.getElementById("task-input");
const taskContainer = document.getElementById("task-container");
const emptyMsg = document.getElementById("empty-msg");

// Initialize tasks array from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 👇 Function to update visibility of task container
function updateTaskBoxVisibility() {
    if (taskContainer.children.length > 0) {
        taskContainer.style.display = "block";
        emptyMsg.style.display = "none";
    } else {
        taskContainer.style.display = "none";
        emptyMsg.style.display = "block";
    }
}

// Function to load tasks when page loads
function loadTasks() {
    taskContainer.innerHTML = '';

    tasks.forEach(task => {
        const taskEl = document.createElement("div");
        taskEl.className = "task-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";

        const taskSpan = document.createElement("span");
        taskSpan.className = "task-text";
        taskSpan.textContent = task.text;

        taskEl.appendChild(checkbox);
        taskEl.appendChild(taskSpan);
        taskContainer.appendChild(taskEl);

        checkbox.addEventListener("change", () => {
            taskSpan.classList.add("completed");
            taskEl.classList.add("fade-out");

            const taskIndex = tasks.findIndex(t => t.text === task.text);
            if (taskIndex > -1) {
                tasks.splice(taskIndex, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }

            setTimeout(() => {
                taskEl.remove();
                updateTaskBoxVisibility(); // 👈 Update visibility after removing
            }, 500);
        });
    });

    // 👇 Update container visibility on load
    updateTaskBoxVisibility();
}

// Add task event listener
addBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        text: taskText,
        completed: false
    };

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    const taskEl = document.createElement("div");
    taskEl.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";

    const taskSpan = document.createElement("span");
    taskSpan.className = "task-text";
    taskSpan.textContent = taskText;

    taskEl.appendChild(checkbox);
    taskEl.appendChild(taskSpan);
    taskContainer.appendChild(taskEl);

    taskInput.value = "";

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
            updateTaskBoxVisibility(); // 👈 Update after task is removed
        }, 500);
    });

    updateTaskBoxVisibility(); // 👈 Update after task is added
});

// Load tasks when the DOM content is loaded
document.addEventListener('DOMContentLoaded', loadTasks);

// Optional: Add Enter key functionality
taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addBtn.click();
    }
});

// At the beginning of your script
const addBtn = document.getElementById("add-btn");
const taskInput = document.getElementById("task-input");
const taskContainer = document.getElementById("task-container");
const emptyMsg = document.getElementById("empty-msg");

// Initialize tasks array from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to load tasks when page loads
function loadTasks() {
    // Clear existing tasks in container
    taskContainer.innerHTML = '';
    
    // Load tasks from localStorage
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
                if (taskContainer.children.length === 0) {
                    emptyMsg.style.display = "block";
                }
            }, 500);
        });
    });

    // Update empty message visibility
    if (tasks.length > 0) {
        emptyMsg.style.display = "none";
    } else {
        emptyMsg.style.display = "block";
    }
}

// Add task event listener
addBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    // Create task object
    const task = {
        text: taskText,
        completed: false
    };

    // Add to tasks array
    tasks.push(task);
    
    // Save to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Create task wrapper
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

    // Reset input
    taskInput.value = "";
    emptyMsg.style.display = "none";

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
            if (taskContainer.children.length === 0) {
                emptyMsg.style.display = "block";
            }
        }, 500);
    });
});

// Load tasks when the DOM content is loaded
document.addEventListener('DOMContentLoaded', loadTasks);

// Optional: Add Enter key functionality
taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addBtn.click();
    }
});

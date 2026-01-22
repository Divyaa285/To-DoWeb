
// DOM Elements

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const jokeEl = document.getElementById("joke");


let tasks = [];


document.addEventListener("DOMContentLoaded", () => {
  loadTasksFromLocalStorage();
  renderTasks();
  updateProgress();
  fetchJoke();
  toggleEmptyMessage();
});

// Add Task

addTaskBtn.addEventListener("click", addTask);

function toggleEmptyMessage() {
  var emptyMessage = document.getElementById("Message");

  if (tasks.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }
}

function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Task cannot be empty! please enter your Task");
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  tasks.push(newTask);
  saveTasksToLocalStorage();
  renderTasks();
  updateProgress();
  toggleEmptyMessage();

  taskInput.value = "";
}


// Render Tasks

function renderTasks() {
  taskList.innerHTML = "";
  

  tasks.forEach(task => {
    const li = document.createElement("li");

    const taskSpan = document.createElement("span");
    taskSpan.className = "task-text";
    taskSpan.innerText = task.text;

    if (task.completed) {
      taskSpan.classList.add("completed");
    }


    // Action Buttons
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "task-actions";

    const completeBtn = document.createElement("button");
    completeBtn.innerText = task.completed ? "Undo" : "Complete";
    completeBtn.className = "complete-btn";
    completeBtn.onclick = () => toggleComplete(task.id);

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => editTask(task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => deleteTask(task.id);

    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(taskSpan);
    li.appendChild(actionsDiv);

    taskList.appendChild(li);
  });
    toggleEmptyMessage();
}


// Toggle Complete

function toggleComplete(taskId) {
  tasks = tasks.map(task =>
    task.id === taskId
      ? { ...task, completed: !task.completed }
      : task
  );

  saveTasksToLocalStorage();
  renderTasks();
  updateProgress();
}

// Edit Task

function editTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  const newText = prompt("Edit your task:", task.text);

  if (newText === null || newText.trim() === "") return;

  task.text = newText.trim();

  saveTasksToLocalStorage();
  renderTasks();
}


// Delete Task

function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);

  saveTasksToLocalStorage();
  renderTasks();
  updateProgress();
  toggleEmptyMessage();
}


// Progress Tracking

function updateProgress() {
  totalTasksEl.innerText = tasks.length;
  const completedCount = tasks.filter(task => task.completed).length;
  completedTasksEl.innerText = completedCount;
}


// Local Storage

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
}


// Bonus API: Chuck Norris Joke

async function fetchJoke() {
  try {
    const response = await fetch("https://api.chucknorris.io/jokes/random");
    const data = await response.json();
    jokeEl.innerText = "Today’s Joke : " + data.value;
  } catch (error) {
    jokeEl.innerText =
      " Couldn't load a joke right now. Please try again later.";
  }
}

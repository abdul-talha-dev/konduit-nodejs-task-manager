const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const errorBox = document.getElementById("error");

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function clearError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

async function loadTasks() {
  try {
    const response = await fetch("/api/tasks");
    if (!response.ok) throw new Error();
    const tasks = await response.json();
    renderTasks(tasks);
  } catch {
    showError("Could not load tasks.");
  }
}

async function loadStats() {
  try {
    const response = await fetch("/api/stats");
    if (!response.ok) throw new Error();
    const stats = await response.json();
    document.getElementById("stat-total").textContent = stats.total;
    document.getElementById("stat-pending").textContent = stats.pending;
    document.getElementById("stat-completed").textContent = stats.completed;
  } catch {
    showError("Could not load statistics.");
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  for (const task of tasks) {
    const item = document.createElement("li");
    item.className = "task" + (task.completed ? " completed" : "");

    const info = document.createElement("div");
    info.className = "task-info";

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const date = document.createElement("span");
    date.className = "task-date";
    date.textContent = formatDate(task.createdAt);

    info.appendChild(title);
    info.appendChild(date);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const toggleButton = document.createElement("button");
    toggleButton.className = "toggle";
    toggleButton.textContent = task.completed ? "Mark pending" : "Complete";
    toggleButton.addEventListener("click", () => toggleTask(task));

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    actions.appendChild(toggleButton);
    actions.appendChild(deleteButton);

    item.appendChild(info);
    item.appendChild(actions);
    taskList.appendChild(item);
  }
}

async function createTask(title) {
  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });

    if (!response.ok) throw new Error();

    titleInput.value = "";
    clearError();
    await refresh();
  } catch {
    showError("Could not create task.");
  }
}

async function toggleTask(task) {
  try {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed })
    });

    if (!response.ok) throw new Error();

    clearError();
    await refresh();
  } catch {
    showError("Could not update task.");
  }
}

async function deleteTask(id) {
  try {
    const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error();

    clearError();
    await refresh();
  } catch {
    showError("Could not delete task.");
  }
}

async function refresh() {
  await loadTasks();
  await loadStats();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) {
    showError("Task title is required.");
    return;
  }
  createTask(title);
});

refresh();

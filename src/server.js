const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "../data");
const DATA_FILE = path.join(DATA_DIR, "tasks.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

function ensureDataFile() {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]");
  }
}

function readTasks() {
  ensureDataFile();

  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (error) {
    console.error("Failed to read tasks:", error);
    return [];
  }
}

function writeTasks(tasks) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

app.get("/api/tasks", (req, res) => {
  res.json(readTasks());
});

app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      error: "Task title is required"
    });
  }

  const tasks = readTasks();

  const task = {
    id: Date.now().toString(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  writeTasks(tasks);

  res.status(201).json(task);
});

app.put("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const task = tasks.find((item) => item.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  if (typeof req.body.title === "string" && req.body.title.trim()) {
    task.title = req.body.title.trim();
  }

  if (typeof req.body.completed === "boolean") {
    task.completed = req.body.completed;
  }

  writeTasks(tasks);

  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const filteredTasks = tasks.filter((item) => item.id !== req.params.id);

  if (filteredTasks.length === tasks.length) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  writeTasks(filteredTasks);

  res.status(204).send();
});

app.get("/api/stats", (req, res) => {
  const tasks = readTasks();

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;

  res.json({
    total: tasks.length,
    pending,
    completed
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "konduit-nodejs-task-manager"
  });
});

ensureDataFile();

app.listen(PORT, () => {
  console.log(`Task Manager running on port ${PORT}`);
});

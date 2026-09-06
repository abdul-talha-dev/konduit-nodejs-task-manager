# Task Manager

A small task manager built with Node.js and Express. Tasks are stored in a
JSON file, and the frontend is plain HTML, CSS, and vanilla JavaScript.

## Features

- View all tasks
- Create tasks
- Mark tasks as completed or pending
- Delete tasks
- Task statistics (total, pending, completed)

## Project structure

```
konduit-nodejs-task-manager/
├── public/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── src/
│   └── server.js
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

## Getting started

Install dependencies and start the server:

```
npm install
npm start
```

The application is then available at:

```
http://localhost:3000
```

## API endpoints

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| GET    | `/api/tasks`     | List all tasks      |
| POST   | `/api/tasks`     | Create a task       |
| PUT    | `/api/tasks/:id` | Update a task       |
| DELETE | `/api/tasks/:id` | Delete a task       |
| GET    | `/api/stats`     | Get task statistics |
| GET    | `/health`        | Health check        |

## Configuration

Task data is stored in `${DATA_DIR}/tasks.json`. Set the `DATA_DIR`
environment variable to control where the file lives:

```
DATA_DIR=/data npm start
```

If `DATA_DIR` is not set, a local `data/` directory inside the project is used.
The directory and `tasks.json` file are created automatically on first run.
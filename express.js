const express = require('express');
const app = express();

app.use(express.json()); 

let todos = [
    { id: 1, task: "Learn Node.js" },
    { id: 2, task: "Build a To-Do App" }
];

app.get('/todos', (req, res) => {
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const newTask = req.body.task;
    if (!newTask) {
        return res.status(400).json({ message: "Task is required" });
    }
    const newTodo = { id: todos.length + 1, task: newTask };
    todos.push(newTodo);
    res.status(201).json({ message: "Task added", todo: newTodo });
});

app.put('/todos/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const updatedTask = req.body.task;

    let task = todos.find(t => t.id === taskId);
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }
    
    if (!updatedTask) {
        return res.status(400).json({ message: "Updated task is required" });
    }

    task.task = updatedTask;
    res.json({ message: "Task updated", task });
});

app.delete('/todos/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter(task => task.id !== taskId);

    if (todos.length === initialLength) {
        return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted", todos });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('server activated');
});

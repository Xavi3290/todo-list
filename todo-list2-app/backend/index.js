// backend/index.js
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Importar la conexión a la base de datos

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Para parsear JSON

// Rutas

// Obtener todas las tareas (GET)
app.get('/api/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Crear una nueva tarea (POST)
app.post('/api/todos', (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }

  db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, task, completed: false });
  });
});

// Actualizar el estado de una tarea (PUT)
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  db.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.sendStatus(204);
  });
});

// Eliminar una tarea (DELETE)
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.sendStatus(204);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

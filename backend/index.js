const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Configura la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'books',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conexión a MySQL establecida');
});

// Configurar middleware para permitir solicitudes desde cualquier origen
app.use(cors());

// Parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Rutas de la API
app.get('/api/books', (req, res) => {
  const query = 'SELECT * FROM books';
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.post('/api/books', (req, res) => {
  const { titulo, autor, año } = req.body;
  const query = 'INSERT INTO books (titulo, autor, año) VALUES (?, ?, ?)';
  connection.query(query, [titulo, autor, año], (error, result) => {
    if (error) throw error;
    res.status(201).json({ id: result.insertId, titulo, autor, año });
  });
});

app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, autor, año } = req.body;
  const query = 'UPDATE books SET titulo=?, autor=?, año=? WHERE id=?';
  connection.query(query, [titulo, autor, año, id], (error) => {
    if (error) throw error;
    res.json({ id, titulo, autor, año });
  });
});

app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM books WHERE id=?';
  connection.query(query, [id], (error) => {
    if (error) throw error;
    res.sendStatus(204);
  });
});

app.head('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT id FROM books WHERE id=?';
  connection.query(query, [id], (error, results) => {
    if (error) throw error;
    if (results.length === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  });
});

app.patch('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, autor, año } = req.body;
  const query = 'UPDATE books SET titulo=?, autor=?, año=? WHERE id=?';
  connection.query(query, [titulo, autor, año, id], (error) => {
    if (error) throw error;
    res.json({ id, titulo, autor, año });
  });
});

app.options('/api/books', (req, res) => {
  res.header('Allow', 'GET, POST, OPTIONS');
  res.sendStatus(200);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

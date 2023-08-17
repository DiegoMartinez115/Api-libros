const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 8000;  // Puedes cambiar el puerto si es necesario

// Rutas estáticas para los archivos del proyecto
app.use(express.static(path.join(__dirname)));  // 'LOGIN' es el nombre de la carpeta del proyecto

// Ruta para manejar todas las solicitudes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'));  // Ruta al archivo HTML
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

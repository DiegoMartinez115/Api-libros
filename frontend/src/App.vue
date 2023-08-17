<template>
  <div>
    <h1>Libros</h1>
    <form @submit.prevent="agregarLibro" v-if="!mostrarFormEditar">
      <input v-model="nuevoLibro.titulo" placeholder="Título" />
      <input v-model="nuevoLibro.autor" placeholder="Autor" />
      <input v-model="nuevoLibro.año" placeholder="Año" type="number" />
      <button type="submit">Agregar Libro</button>
    </form>

    <form @submit.prevent="actualizarLibro" v-if="mostrarFormEditar">
      <input v-model="libroEditar.titulo" placeholder="Título" />
      <input v-model="libroEditar.autor" placeholder="Autor" />
      <input v-model="libroEditar.año" placeholder="Año" type="number" />
      <button type="submit">Guardar Cambios</button>
      <button @click="cancelarEdicion">Cancelar</button>
    </form>

    <ul>
      <li v-for="libro in libros" :key="libro.id">
        <span>{{ libro.titulo }} - {{ libro.autor }} ({{ libro.año }})</span>
        <button @click="eliminarLibro(libro.id)">Eliminar</button>
        <button @click="editarLibro(libro)">Editar</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const libros = ref([]);
    const nuevoLibro = reactive({
      titulo: '',
      autor: '',
      año: null,
    });
    const libroEditar = reactive({
      id: null,
      titulo: '',
      autor: '',
      año: null,
    });
    const mostrarFormEditar = ref(false);

    const cargarLibros = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/books');
        libros.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    const agregarLibro = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/books', nuevoLibro);
        libros.value.push(response.data);
        nuevoLibro.titulo = '';
        nuevoLibro.autor = '';
        nuevoLibro.año = null;
      } catch (error) {
        console.error(error);
      }
    };

    const eliminarLibro = async (id) => {
      try {
        await axios.delete(`http://localhost:3000/api/books/${id}`);
        libros.value = libros.value.filter((libro) => libro.id !== id);
      } catch (error) {
        console.error(error);
      }
    };

    const verificarExistenciaLibro = async (id) => {
      try {
        await axios.head(`http://localhost:3000/api/books/${id}`);
        return true;
      } catch (error) {
        return false;
      }
    };

    const actualizarLibro = async () => {
      try {
        const { id, titulo, autor, año } = libroEditar;

        if (!id) {
          console.error('El ID del libro a actualizar no está definido.');
          return;
        }

        const existeLibro = await verificarExistenciaLibro(id);

        if (!existeLibro) {
          console.error(`El libro con ID ${id} no existe.`);
          return;
        }

        const response = await axios.patch(`http://localhost:3000/api/books/${id}`, {
          titulo,
          autor,
          año,
        });

        if (response.status === 200) {
          console.log(`Libro con ID ${id} actualizado con éxito.`);
          cargarLibros();
          cancelarEdicion();
        } else {
          console.error(`Hubo un problema al actualizar el libro con ID ${id}.`);
        }
      } catch (error) {
        console.error('Error al actualizar el libro:', error);
      }
    };

    const cancelarEdicion = () => {
      mostrarFormEditar.value = false;
      libroEditar.id = null;
      libroEditar.titulo = '';
      libroEditar.autor = '';
      libroEditar.año = null;
    };

    const editarLibro = (libro) => {
      libroEditar.id = libro.id;
      libroEditar.titulo = libro.titulo;
      libroEditar.autor = libro.autor;
      libroEditar.año = libro.año;
      mostrarFormEditar.value = true;
    };

    onMounted(cargarLibros);

    return {
      libros,
      nuevoLibro,
      libroEditar,
      mostrarFormEditar,
      cargarLibros,
      agregarLibro,
      eliminarLibro,
      actualizarLibro,
      cancelarEdicion,
      editarLibro,
    };
  },
};
</script>

<style>
  form {
    margin-bottom: 20px; 
  }

  form input,
  form button {
    margin-right: 10px; 
  }

  ul li {
    margin-bottom: 10px; 
  }

  ul li button {
    margin-left: 10px; 
  }
</style>
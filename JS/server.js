const express = require('express');
const { getDB } = require('./conexion');
const cors = require('cors');
const app = express();
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/agencia_autos', { useNewUrlParser: true, useUnifiedTopology: true });

const autoSchema = new mongoose.Schema({
  Marca: String,
  Modelo: String,
  Año: Number,
  Precio: Number,
  Disponibilidad: Boolean,
});

const autos = mongoose.model('Auto', autoSchema);


/***************** Crear un auto ********************/



app.post('/api/guardar-auto', async (req, res) => {
  try {
      const db = getDB(); // Función que obtiene la instancia de la base de datos
      const { ID_Auto, Marca, Modelo, Año, Precio, Disponibilidad } = req.body;

      // Verifica si el ID_Auto es válido y convierte el string a ObjectId si es necesario
      const autoID = ID_Auto ? new ObjectId(ID_Auto) : new ObjectId();

      const filter = { _id: autoID };
      const update = {
          $set: {
              Marca,
              Modelo,
              Año,
              Precio,
              Disponibilidad
          }
      };

      const options = { upsert: true }; // Esta opción permite crear el documento si no existe

      const result = await db.collection('autos').updateOne(filter, update, options);

      if (result.upsertedCount > 0) {
          // Si se inserta un nuevo documento
          res.status(201).json({ message: 'Auto insertado correctamente', id: result.upsertedId });
      } else {
          // Si se actualiza un documento existente
          res.status(200).json({ message: 'Auto actualizado correctamente' });
      }
  } catch (error) {
      console.error('Error al guardar el auto:', error);
      res.status(500).json({ error: 'Error en el servidor' });
  }
});

/***************** Leer autos ********************/

app.get('/api/obtener-autos', async (req, res) => {
    try {
        const { marca } = req.query;

        // Construimos el filtro para la búsqueda
        const vehiculos = await autos.find({ Marca: new RegExp(marca, 'i') });
        res.status(200).json(vehiculos);
    } catch (error) {
        console.error('Error al obtener autos:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.get('/api/completar-auto/:id', async (req, res) => {
  try {
      const db = getDB();
      const id = req.params.id;
      
      // Convierte el id en un ObjectId para MongoDB
      const auto = await db.collection('autos').findOne({ _id: new ObjectId(id) });

      if (!auto) {
          return res.status(404).json({ error: 'Auto no encontrado' });
      }
      res.json(auto);
  } catch (error) {
      console.error('Error al obtener el auto:', error);
      res.status(500).json({ error: 'Error en el servidor' });
  }
});

/***************** Actualizar un auto ********************/

app.put('/api/actualizar-auto/:id', async (req, res) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const { Precio, Disponibilidad } = req.body;

        const resultado = await db.collection('autos').updateOne(
            { _id: new MongoClient.ObjectId(id) },
            { $set: { Precio, Disponibilidad } }
        );

        if (resultado.modifiedCount === 0) {
            return res.status(404).json({ error: 'Auto no encontrado' });
        }

        res.status(200).json({ message: 'Auto actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el auto:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

/***************** Eliminar un auto ********************/

app.delete('/api/eliminar-auto/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const resultado = await autos.findByIdAndDelete(id);

        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: 'Auto no encontrado' });
        }

        res.status(200).json({ message: 'Auto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el auto:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

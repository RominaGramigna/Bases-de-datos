const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let db;

async function connectDB() {
    try {
        await client.connect();
        console.log('Conexión establecida con MongoDB');
        db = client.db('agencia_autos');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
    }
}

connectDB();

module.exports = {
    getDB: () => db,
};

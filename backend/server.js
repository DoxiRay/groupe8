const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const productRoutes = require('./api/products'); // Chemin vers le fichier des routes produits
const soldRoutes = require('./api/price');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', productRoutes); // Montage des routes produits sous /api
app.use('/api/price', soldRoutes);

const dbPath = path.resolve(__dirname, './products.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT,
            name TEXT,
            number INTEGER,
            price INTEGER,
            date TEXT
        )`);
    });
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app; // Export de l'application Express pour les tests ou l'intégration ultérieure

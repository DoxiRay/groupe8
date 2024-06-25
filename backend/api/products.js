const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../products.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
    }
});

// GET all products
router.get('/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// POST a new product
router.post('/products', (req, res) => {
    const { code, name, number, price, date } = req.body;

    db.run(
        'INSERT INTO products (code, name, number, price, date) VALUES (?, ?, ?, ?, ?)',
        [code, name, number, price, date],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({
                id: this.lastID,
                code,
                name,
                number,
                price,
                date
            });
        }
    );
});

// PUT update a product by ID
router.put('/products/:id', (req, res) => {
    const id = req.params.id;
    const { code, name, number, price, date } = req.body;

    db.run(
        'UPDATE products SET code = ?, name = ?, number = ?, price = ?, date = ? WHERE id = ?',
        [code, name, number, price, date, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ message: 'Product not found' });
                return;
            }
            res.json({ message: 'Product updated successfully' });
        }
    );
});

// DELETE a product by ID
router.delete('/products/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM products WHERE id = ?', id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json({ message: 'Product deleted' });
    });
});

module.exports = router;

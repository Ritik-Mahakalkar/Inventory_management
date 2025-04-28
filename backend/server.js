const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(bodyParser.json());


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'Inventry_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();


app.post('/products', async (req, res) => {
  const { user_id, product_name, quantity, price } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO products (user_id, product_name, quantity, price, created_at) VALUES (?, ?, ?, ?, NOW())',
      [user_id, product_name, quantity, price]
    );
    res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding product' });
  }
});


app.get('/products/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});


app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { product_name, quantity, price } = req.body;
  try {
    await pool.execute(
      'UPDATE products SET product_name = ?, quantity = ?, price = ? WHERE id = ?',
      [product_name, quantity, price, id]
    );
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product' });
  }
});


app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

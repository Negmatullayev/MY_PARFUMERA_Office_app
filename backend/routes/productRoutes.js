const express = require('express');
const fs = require('fs');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();
const productsPath = path.join(__dirname, '../data/products.json');

// Get all products
router.get('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  res.json(products);
});

// Admin: Add a product
router.post('/', protect, admin, (req, res) => {
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  const newProduct = {
    id: Date.now(),
    name: req.body.name || 'Sample name',
    brand: req.body.brand || 'Sample brand',
    price: req.body.price || 0,
    description: req.body.description || 'Sample description',
    image: req.body.image || 'https://via.placeholder.com/300'
  };

  products.push(newProduct);
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  
  res.status(201).json(newProduct);
});

// Admin: Delete a product
router.delete('/:id', protect, admin, (req, res) => {
  let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));

  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

module.exports = router;

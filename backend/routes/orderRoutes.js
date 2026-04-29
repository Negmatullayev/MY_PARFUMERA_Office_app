const express = require('express');
const fs = require('fs');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();
const ordersPath = path.join(__dirname, '../data/orders.json');

// POST: Yangi buyurtma berish (Foydalanuvchi)
router.post('/', protect, (req, res) => {
  const { cartItems, totalPrice, address } = req.body;
  
  if (cartItems && cartItems.length === 0) {
    return res.status(400).json({ message: "Savat bo'sh" });
  }

  const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));

  const order = {
    id: Date.now(),
    user: { id: req.user.id, name: req.user.name, email: req.user.email },
    orderItems: cartItems,
    shippingAddress: address,
    totalPrice: totalPrice,
    status: 'Kutilmoqda', // Pending, Processing, Shipped, Delivered
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));

  res.status(201).json(order);
});

// GET: Foydalanuvchining o'z buyurtmalarini olishi
router.get('/myorders', protect, (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
  const userOrders = orders.filter(o => o.user.id === req.user.id);
  res.json(userOrders);
});

// GET: Barcha buyurtmalarni olish (Faqat ADMIN uchun)
router.get('/', protect, admin, (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
  res.json(orders);
});

// PUT: Buyurtma holatini (Status) o'zgartirish (Faqat ADMIN)
router.put('/:id/status', protect, admin, (req, res) => {
  const { status } = req.body;
  let orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
  
  const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
  
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
    res.json(orders[orderIndex]);
  } else {
    res.status(404).json({ message: 'Buyurtma topilmadi' });
  }
});

module.exports = router;

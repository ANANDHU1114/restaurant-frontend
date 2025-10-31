const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

// Create order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all orders (with optional query parameters: search)
// Protected: only authenticated users can list orders (admin or staff)
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [ { customerName: re }, { 'items.name': re }, { status: re } ];
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single order
// Protected: require auth to view order details
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order
// Protected: require auth to update (status changes require admin)
router.put('/:id', auth, async (req, res) => {
  try {
    // If status is being changed, only admins are allowed to change status
    if (req.body && Object.prototype.hasOwnProperty.call(req.body, 'status')) {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required to change order status' });
      }
    }

    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete order
// Protected: require auth
router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

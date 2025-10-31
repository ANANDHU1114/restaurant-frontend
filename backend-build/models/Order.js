const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: false },
  tableNumber: { type: Number },
  items: { type: [ItemSchema], default: [] },
  status: { type: String, enum: ['pending','preparing','served','cancelled'], default: 'pending' },
  total: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

OrderSchema.pre('save', function(next) {
  this.total = this.items.reduce((sum, it) => sum + (it.qty * it.price), 0);
  next();
});

module.exports = mongoose.model('Order', OrderSchema);

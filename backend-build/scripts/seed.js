require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restaurant_db';

const sampleItems = [
  {
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    category: 'Pizza',
    available: true
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Traditional pizza topped with spicy pepperoni slices',
    price: 14.99,
    category: 'Pizza',
    available: true
  },
  {
    name: 'Greek Salad',
    description: 'Fresh mixed greens with feta, olives, and house dressing',
    price: 8.99,
    category: 'Salads',
    available: true
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers',
    price: 6.99,
    category: 'Desserts',
    available: true
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing items
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');

    // Insert sample items
    const items = await MenuItem.insertMany(sampleItems);
    console.log('Inserted sample items:', items.map(it => it.name).join(', '));

    // Clear existing orders and insert sample orders
    const Order = require('../models/Order');
    await Order.deleteMany({});
    console.log('Cleared existing orders');

    // create a helper to find price by name
    const priceOf = (name) => {
      const it = items.find(x => x.name === name);
      return it ? it.price : 0;
    }

    // Insert sample orders. You can control count and randomization via env vars:
    // ORDER_SEED_COUNT (default 10), ORDER_SEED_RANDOMIZE_STATUSES ('true'|'false')
    const ORDER_SEED_COUNT = parseInt(process.env.ORDER_SEED_COUNT || '10', 10);
    const RANDOMIZE_STATUSES = (process.env.ORDER_SEED_RANDOMIZE_STATUSES || 'true') === 'true';

    const statuses = ['pending','preparing','served','cancelled'];
    const sampleNames = ['Alice','Bob','Charlie','Diana','Ethan','Fiona','George','Hannah','Isha','Jay'];

    function randInt(min, max) { return Math.floor(Math.random()*(max-min+1)) + min }
    function pick(array){ return array[Math.floor(Math.random()*array.length)] }

    const createdOrders = [];
    for (let i=0;i<ORDER_SEED_COUNT;i++){
      const cust = pick(sampleNames) + (randInt(1,99));
      const numItems = randInt(1,3);
      const orderItems = [];
      for (let j=0;j<numItems;j++){
        const menuIt = pick(items);
        orderItems.push({ name: menuIt.name, qty: randInt(1,3), price: menuIt.price });
      }
      const status = RANDOMIZE_STATUSES ? pick(statuses) : (i===0 ? 'pending' : (i===1 ? 'preparing' : 'pending'));
  // Do not auto-generate an email for sample orders; only set customerName and optional tableNumber/items/status
  const ord = { customerName: cust, tableNumber: randInt(1,12), items: orderItems, status };
      createdOrders.push(ord);
    }

    const inserted = await Order.insertMany(createdOrders);
    console.log(`Inserted ${inserted.length} sample orders with statuses:`, inserted.map(o=>o.status).slice(0,20).join(', '));

    // Create admin user if not exists
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpass';
    const adminName = process.env.ADMIN_NAME || 'Administrator';

    const existingAdmin = await User.findOne({
      $or: [{ username: adminUsername }, { email: adminEmail }]
    });
    if (existingAdmin) {
      // If an admin exists but doesn't have a username (older seed), add it if available
      if (!existingAdmin.username) {
        const taken = await User.findOne({ username: adminUsername });
        if (!taken) {
          existingAdmin.username = adminUsername;
          existingAdmin.role = existingAdmin.role || 'admin';
          await existingAdmin.save();
          console.log(`Updated existing admin with username: ${adminUsername}`);
        } else {
          console.log(`Found existing admin by email but username '${adminUsername}' is taken by another user; leaving existing user unchanged.`);
        }
      } else {
        console.log(`Admin user already exists: ${existingAdmin.username}`);
      }
    } else {
      const admin = new User({ 
        name: adminName, 
        username: adminUsername,
        email: adminEmail, 
        password: adminPassword, 
        role: 'admin' 
      });
      await admin.save();
      console.log(`Created admin user: ${adminUsername} (password: ${adminPassword})`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
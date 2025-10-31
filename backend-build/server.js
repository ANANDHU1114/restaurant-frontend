const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log('Starting server.js (cwd=' + process.cwd() + ')');

const app = express();
app.use(cors());
app.use(express.json());

const { auth, adminOnly } = require('./middleware/auth');
const authRouter = require('./routes/auth');
const ordersRouter = require('./routes/orders');
const menuRouter = require('./routes/menu');
const usersRouter = require('./routes/users');
const passwordResetRouter = require('./routes/password-reset');

// Public routes
app.use('/api/auth', authRouter);
app.use('/api/password-reset', passwordResetRouter);
app.use('/api/menu', menuRouter); // Menu view is public

// Orders: allow public creation (customers) but protect management routes inside the router.
app.use('/api/orders', ordersRouter);
app.use('/api/menu/manage', auth, adminOnly, menuRouter); // Admin menu management
app.use('/api/users', auth, adminOnly, usersRouter); // Admin user management

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant_db';

console.log('Attempting MongoDB connection to:', MONGO_URI);

// Add short timeouts so failed connections fail fast during debugging
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 })
  .then(() => {
    console.log('Connected to MongoDB');

    // Optional: create admin on start when explicitly requested via env var
    // Usage (PowerShell): $env:CREATE_ADMIN_ON_START='true'; $env:ADMIN_EMAIL='admin@you.com'; $env:ADMIN_PASSWORD='secret'; node server.js
    (async () => {
      try {
        if (process.env.CREATE_ADMIN_ON_START === 'true') {
          const User = require('./models/User');
          const adminUsername = process.env.ADMIN_USERNAME || 'admin';
          const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
          const adminPassword = process.env.ADMIN_PASSWORD || 'adminpass';
          const adminName = process.env.ADMIN_NAME || 'Administrator';

          const existing = await User.findOne({ $or: [{ email: adminEmail }, { username: adminUsername }] });
          if (existing) {
            // If admin exists but missing a username, try to set it (seed.js behavior)
            if (!existing.username) {
              const taken = await User.findOne({ username: adminUsername });
              if (!taken) {
                existing.username = adminUsername;
                existing.role = existing.role || 'admin';
                await existing.save();
                console.log(`Updated existing admin with username: ${adminUsername}`);
              } else {
                console.log(`Found existing admin by email but username '${adminUsername}' is taken; leaving existing user unchanged.`);
              }
            } else {
              console.log(`Admin user already exists: ${existing.username || adminEmail}`);
            }
          } else {
            const admin = new User({ name: adminName, username: adminUsername, email: adminEmail, password: adminPassword, role: 'admin' });
            await admin.save();
            console.log(`Created admin user: ${adminUsername} (email: ${adminEmail})`);
          }
        }
      } catch (err) {
        console.error('Error creating admin on start:', err.message || err);
      } finally {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
      }
    })();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

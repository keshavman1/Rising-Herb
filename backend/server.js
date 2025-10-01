// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');

// routes
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const herbRoutes = require('./routes/herbs');

// seed util (ensure file is at backend/utils/seedAdmins.js)
const seedAdmins = require('./utils/seedAdmins');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// rate limiter (tune as needed)
const limiter = rateLimit({ windowMs: 60 * 1000, max: 200 });
app.use(limiter);

// Routes (order doesn't matter much here)
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/herbs', herbRoutes);
app.use('/api/chat', chatRoutes);

// Simple health-check
app.get('/api/health', (req, res) => res.json({ ok: true, now: new Date().toISOString() }));

// Start server + DB connection
async function start() {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI not set in .env');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true
    });
    console.log('MongoDB connected');

    // Seed admins (idempotent) — ensure utils/seedAdmins.js exists and exports a function
    try {
      await seedAdmins();
    } catch (seedErr) {
      console.warn('Warning: seedAdmins() failed (non-fatal):', seedErr.message || seedErr);
    }

    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
}

start();

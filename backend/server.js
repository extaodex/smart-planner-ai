const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/tasks',    require('./routes/tasks'));
app.use('/api/courses',  require('./routes/courses'));
app.use('/api/ai',       require('./routes/ai'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Smart Planner AI Backend running 🚀' }));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-planner')
  .then(() => {
    console.log('✅ MongoDB connecté');
    app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB:', err.message);
    console.log('⚠️  Lancement sans MongoDB (mode démo)...');
    app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT} (mode démo)`));
  });

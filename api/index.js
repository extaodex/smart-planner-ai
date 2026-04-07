const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ 
  origin: true, // Autoriser toutes les origines pour le déploiement
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

// Initialisation de MongoDB
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/smart-planner';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur MongoDB:', err.message));

// Pour Vercel : Exportation de l'application
// On ne lance app.listen que si on n'est pas sur Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
}

module.exports = app;

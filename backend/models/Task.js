const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  due:         { type: String, default: '' },
  priority:    { type: String, enum: ['Urgent', 'Moyen', 'Faible'], default: 'Moyen' },
  type:        { type: String, enum: ['Devoirs', 'Examens', 'Cours'], default: 'Devoirs' },
  done:        { type: Boolean, default: false },
  aiTime:      { type: String, default: '~1h' },
  createdAt:   { type: Date, default: Date.now },
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Task', TaskSchema);

const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title:   { type: String, required: true, trim: true },
  day:     { type: Number, required: true, min: 0, max: 6 }, // 0=Monday
  start:   { type: Number, required: true }, // index in hours array (0=08:00)
  duration:{ type: Number, required: true, default: 1 },
  room:    { type: String, default: '' },
  color:   { type: String, default: '#6366f1' },
  professor:{ type: String, default: '' },
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Course', CourseSchema);

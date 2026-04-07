const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// In-Memory Fallback
let memCourses = [];
const isMongoConnected = () => mongoose.connection.readyState === 1;

// GET all courses (connected user only)
router.get('/', auth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const courses = await Course.find({ userId: req.user.id });
      return res.json(courses);
    }
    const courses = memCourses.filter(c => c.userId === req.user.id);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create course
router.post('/', auth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const course = new Course({ ...req.body, userId: req.user.id });
      await course.save();
      return res.status(201).json(course);
    }
    const newCourse = { _id: Date.now().toString(), ...req.body, userId: req.user.id };
    memCourses.push(newCourse);
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE course
router.delete('/:id', auth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const course = await Course.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
      if (!course) return res.status(404).json({ error: 'Cours introuvable ou accès refusé' });
      return res.json({ message: 'Cours supprimé' });
    }
    const initLen = memCourses.length;
    memCourses = memCourses.filter(c => !(c._id === req.params.id && c.userId === req.user.id));
    if (memCourses.length === initLen) return res.status(404).json({ error: 'Cours introuvable' });
    res.json({ message: 'Cours supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

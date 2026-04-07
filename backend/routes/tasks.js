const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// In-Memory Fallback
let memTasks = [];
const isMongoConnected = () => mongoose.connection.readyState === 1;

// GET all tasks (connected user only)
router.get('/', auth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
      return res.json(tasks);
    }
    const tasks = memTasks.filter(t => t.userId === req.user.id).sort((a, b) => b.createdAt - a.createdAt);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create task
router.post('/', auth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const task = new Task({ ...req.body, userId: req.user.id });
      await task.save();
      return res.status(201).json(task);
    }
    const newTask = { 
      _id: Date.now().toString(), 
      ...req.body, 
      userId: req.user.id, 
      done: false, 
      createdAt: new Date().getTime() 
    };
    memTasks.unshift(newTask);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH toggle done
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
      if (!task) return res.status(404).json({ error: 'Tâche introuvable ou accès refusé' });
      task.done = !task.done;
      await task.save();
      return res.json(task);
    }
    const task = memTasks.find(t => t._id === req.params.id && t.userId === req.user.id);
    if (!task) return res.status(404).json({ error: 'Tâche introuvable' });
    task.done = !task.done;
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
router.delete('/:id', auth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
      if (!task) return res.status(404).json({ error: 'Tâche introuvable ou accès refusé' });
      return res.json({ message: 'Tâche supprimée' });
    }
    const initLen = memTasks.length;
    memTasks = memTasks.filter(t => !(t._id === req.params.id && t.userId === req.user.id));
    if (memTasks.length === initLen) return res.status(404).json({ error: 'Tâche introuvable' });
    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

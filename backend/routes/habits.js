const express = require('express');
const { Habit } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Require auth for all habit routes
router.use(authenticateToken);

// Get all habits for user
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    // Parse JSON datesDone
    const formattedHabits = habits.map(h => {
      let parsedDates = [];
      try {
        parsedDates = JSON.parse(h.datesDone || '[]');
      } catch(e) {}
      
      return {
        id: h.id,
        name: h.name,
        description: h.description,
        datesDone: parsedDates,
        createdAt: h.createdAt
      };
    });

    res.json(formattedHabits);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new habit
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const habit = await Habit.create({
      userId: req.user.id,
      name,
      description,
      datesDone: '[]'
    });

    res.status(201).json({
      id: habit.id,
      name: habit.name,
      description: habit.description,
      datesDone: [],
      createdAt: habit.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sync habits from local to backend
router.post('/sync', async (req, res) => {
  try {
    const localHabits = req.body;
    if (!Array.isArray(localHabits)) {
      return res.status(400).json({ error: 'Expected an array of habits' });
    }

    // Process each local habit
    for (const lh of localHabits) {
      if (!lh.name) continue;

      // Find by name to prevent duplicates on sync, or just insert if we trust IDs (but local IDs might conflict)
      // Since local IDs might be generated locally (e.g., Date.now()), we'll match by name as a simple sync strategy.
      let habit = await Habit.findOne({ where: { name: lh.name, userId: req.user.id } });
      
      let newDatesDone = Array.isArray(lh.datesDone) ? lh.datesDone : [];
      
      if (habit) {
        // Merge datesDone
        let existingDates = [];
        try { existingDates = JSON.parse(habit.datesDone || '[]'); } catch(e){}
        const mergedDates = [...new Set([...existingDates, ...newDatesDone])];
        habit.datesDone = JSON.stringify(mergedDates);
        if (lh.description) habit.description = lh.description;
        await habit.save();
      } else {
        // Create new
        await Habit.create({
          userId: req.user.id,
          name: lh.name,
          description: lh.description || '',
          datesDone: JSON.stringify(newDatesDone)
        });
      }
    }

    // Return all habits from DB after sync
    const dbHabits = await Habit.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    const formattedHabits = dbHabits.map(h => {
      let parsedDates = [];
      try { parsedDates = JSON.parse(h.datesDone || '[]'); } catch(e) {}
      return {
        id: h.id,
        name: h.name,
        description: h.description,
        datesDone: parsedDates,
        createdAt: h.createdAt
      };
    });

    res.json(formattedHabits);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a habit
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const habitId = req.params.id;

    const habit = await Habit.findOne({ where: { id: habitId, userId: req.user.id } });
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    habit.name = name !== undefined ? name : habit.name;
    habit.description = description !== undefined ? description : habit.description;
    await habit.save();

    let parsedDates = [];
    try {
      parsedDates = JSON.parse(habit.datesDone || '[]');
    } catch(e) {}

    res.json({
      id: habit.id,
      name: habit.name,
      description: habit.description,
      datesDone: parsedDates,
      createdAt: habit.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a habit
router.delete('/:id', async (req, res) => {
  try {
    const habitId = req.params.id;
    const habit = await Habit.findOne({ where: { id: habitId, userId: req.user.id } });
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    await habit.destroy();
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark habit as done for a date
router.post('/:id/done', async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ error: 'Date is required (YYYY-MM-DD)' });
    }

    const habitId = req.params.id;
    const habit = await Habit.findOne({ where: { id: habitId, userId: req.user.id } });
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    let parsedDates = [];
    try {
      parsedDates = JSON.parse(habit.datesDone || '[]');
    } catch(e) {}

    if (!parsedDates.includes(date)) {
      parsedDates.push(date);
      habit.datesDone = JSON.stringify(parsedDates);
      await habit.save();
    }

    res.json({
      id: habit.id,
      name: habit.name,
      description: habit.description,
      datesDone: parsedDates,
      createdAt: habit.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

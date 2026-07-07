const express = require('express');
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['username', 'displayName', 'profilePic', 'bio']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { profilePic, bio, displayName } = req.body;
    
    await User.update(
      { profilePic, bio, displayName },
      { where: { id: req.user.id } }
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Get public profile by username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username.toLowerCase() },
      attributes: ['username', 'displayName', 'profilePic', 'bio']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

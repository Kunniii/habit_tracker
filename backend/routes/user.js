const express = require('express');
const { User } = require('../models');
const { authenticateToken, secret } = require('../middleware/auth');
const { SignJWT } = require('jose');

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

    // Sliding expiration: Issue a new token valid for 14 days
    const newToken = await new SignJWT({ id: req.user.id, username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('14d')
      .sign(secret);

    // Expose header so CORS frontend can read it
    res.setHeader('Access-Control-Expose-Headers', 'X-New-Token');
    res.setHeader('X-New-Token', newToken);

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

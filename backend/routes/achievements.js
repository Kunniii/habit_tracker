const express = require('express');
const { Achievement, User, Comment, sequelize } = require('../models');
const { Op } = require('sequelize');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create achievement share (Requires Auth)
router.post('/share', authenticateToken, async (req, res) => {
  try {
    const { habitName, streak, comment, userInfo } = req.body;
    
    if (!habitName || streak == null) {
      return res.status(400).json({ error: 'habitName and streak are required' });
    }

    if (comment && comment.length > 400) {
      return res.status(400).json({ error: 'Comment cannot exceed 400 characters' });
    }

    // Check if already shared today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingAchievement = await Achievement.findOne({
      where: {
        userId: req.user.id,
        habitName,
        createdAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    if (existingAchievement) {
      return res.status(400).json({ error: 'Bạn đã chia sẻ thói quen này hôm nay rồi!' });
    }

    const achievement = await Achievement.create({
      userId: req.user.id,
      habitName,
      streak,
      comment,
      userInfo: userInfo ? JSON.stringify(userInfo) : null,
    });

    res.status(201).json({ id: achievement.id, message: 'Achievement shared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get achievements feed (Public)
router.get('/feed', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const achievements = await Achievement.findAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Comments AS comment
              WHERE comment.achievementId = Achievement.id
            )`),
            'commentCount'
          ]
        ]
      },
      include: {
        model: User,
        as: 'user',
        attributes: ['username', 'displayName', 'profilePic']
      }
    });

    const feed = achievements.map(ach => {
      let parsedUserInfo = null;
      if (ach.userInfo) {
          try { parsedUserInfo = JSON.parse(ach.userInfo); } catch(e) {}
      }
      return {
        id: ach.id,
        user: ach.user?.username || 'Unknown',
        userDisplayName: ach.user?.displayName || ach.user?.username || 'Unknown',
        profilePic: ach.user?.profilePic,
        habitName: ach.habitName,
        streak: ach.streak,
        message: ach.comment, // Map to message for frontend compat
        userInfo: parsedUserInfo,
        cheers: ach.cheers || 0,
        commentCount: ach.dataValues.commentCount || 0,
        date: ach.createdAt,
      };
    });

    res.json(feed);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cheer for an achievement (Public/Anonymous allowed for simplicity)
router.post('/:id/cheer', async (req, res) => {
  try {
    const achievement = await Achievement.findByPk(req.params.id);
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    
    const amount = parseInt(req.body.amount, 10) || 1;
    achievement.cheers = (achievement.cheers || 0) + amount;
    await achievement.save();
    
    res.json({ id: achievement.id, cheers: achievement.cheers });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get achievement by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findByPk(req.params.id, {
      include: {
        model: User,
        as: 'user',
        attributes: ['username', 'displayName', 'profilePic']
      }
    });

    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    // Parse userInfo if it exists
    let parsedUserInfo = null;
    if (achievement.userInfo) {
        try {
            parsedUserInfo = JSON.parse(achievement.userInfo);
        } catch(e) {}
    }

    res.json({
      id: achievement.id,
      user: achievement.user?.username || 'Unknown',
      userDisplayName: achievement.user?.displayName || achievement.user?.username || 'Unknown',
      profilePic: achievement.user?.profilePic,
      habitName: achievement.habitName,
      streak: achievement.streak,
      message: achievement.comment, // Map to message for frontend compat
      userInfo: parsedUserInfo,
      cheers: achievement.cheers || 0,
      date: achievement.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get comments for an achievement
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { achievementId: req.params.id },
      order: [['createdAt', 'DESC']],
      include: {
        model: User,
        as: 'user',
        attributes: ['username', 'displayName', 'profilePic']
      }
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a comment to an achievement
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content cannot be empty' });
    }

    const achievement = await Achievement.findByPk(req.params.id);
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    const comment = await Comment.create({
      content,
      userId: req.user.id,
      achievementId: achievement.id
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: {
        model: User,
        as: 'user',
        attributes: ['username', 'displayName', 'profilePic']
      }
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit a comment
router.put('/:achievementId/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content cannot be empty' });
    }

    const comment = await Comment.findOne({
      where: { id: req.params.commentId, achievementId: req.params.achievementId }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }

    comment.content = content;
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a comment
router.delete('/:achievementId/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findOne({
      where: { id: req.params.commentId, achievementId: req.params.achievementId },
      include: {
        model: Achievement,
        as: 'achievement',
        attributes: ['userId']
      }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const isCommentAuthor = comment.userId === req.user.id;
    const isPostAuthor = comment.achievement.userId === req.user.id;

    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({ error: 'You do not have permission to delete this comment' });
    }

    await comment.destroy();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

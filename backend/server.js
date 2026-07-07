require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const achievementRoutes = require('./routes/achievements');
const userRoutes = require('./routes/user');
const habitRoutes = require('./routes/habits');
const { sequelize, Achievement, User } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Simple console logging monitor for non-production environments
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/user', userRoutes);
app.use('/api/habits', habitRoutes);

// Serve static built frontend
const frontendPath = path.join(__dirname, '../dist');
app.use(express.static(frontendPath));

// Dynamic Open Graph for feed share
app.get('/feed/:id', async (req, res, next) => {
  try {
    const achievement = await Achievement.findByPk(req.params.id, {
      include: {
        model: User,
        as: 'user',
        attributes: ['username', 'displayName']
      }
    });

    if (!achievement) {
      return next(); // Fallback to standard index.html if not found
    }

    const htmlPath = path.join(frontendPath, 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf-8');

    const username = achievement.user?.displayName || achievement.user?.username || 'Một người bạn';
    const habitName = achievement.habitName;
    const streak = achievement.streak;
    const comment = achievement.comment || '';
    
    const title = `HabitFlow - ${username} vừa chia sẻ thành tích!`;
    const description = `${username} vừa hoàn thành chuỗi ${streak} ngày thói quen "${habitName}". ${comment}`;

    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    html = html.replace(/<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${title}" />`);
    html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta property="twitter:title" content="[^"]*" \/>/, `<meta property="twitter:title" content="${title}" />`);
    
    html = html.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`);
    html = html.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`);
    html = html.replace(/<meta property="twitter:description" content="[^"]*" \/>/, `<meta property="twitter:description" content="${description}" />`);

    res.send(html);
  } catch (err) {
    console.error('Error fetching achievement for OG tags:', err);
    next(); // Fallback on error
  }
});

// Fallback to index.html for SPA routing (only if not an API request)
app.get(/(.*)/, (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Sync database then start server
sequelize.sync().then(() => {
  console.log('Database synced via Sequelize');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});

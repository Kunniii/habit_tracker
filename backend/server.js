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
const satori = require('satori').default || require('satori');
const { Resvg } = require('@resvg/resvg-js');

let interRegular, interBold;
try {
  interRegular = fs.readFileSync(path.join(__dirname, 'node_modules', '@fontsource', 'inter', 'files', 'inter-latin-400-normal.woff'));
  interBold = fs.readFileSync(path.join(__dirname, 'node_modules', '@fontsource', 'inter', 'files', 'inter-latin-700-normal.woff'));
} catch (e) {
  console.warn('Could not load Inter font', e);
}

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

// Dynamic Open Graph Image generation
app.get('/api/achievements/:id/og-image', async (req, res) => {
  try {
    const achievement = await Achievement.findByPk(req.params.id, {
      include: { model: User, as: 'user', attributes: ['username', 'displayName'] }
    });

    if (!achievement || !interRegular) {
      return res.status(404).send('Not found');
    }

    const username = achievement.user?.displayName || achievement.user?.username || 'Một người bạn';
    
    // Process message similar to frontend
    let message = achievement.comment || 'Đã hoàn thành một thói quen!';
    if (message === 'Completed a habit!') message = 'Đã hoàn thành một thói quen!';
    if (message === 'I just crushed my daily goal!') message = 'Tôi vừa hoàn thành mục tiêu hàng ngày!';
    if (message === "I'm staying consistent!") message = 'Tôi đang giữ được sự kiên trì!';
    
    // Create element structure for Satori resembling SinglePost
    const element = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F9FAFB', // canvas color roughly
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '800px',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '48px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #E5E7EB',
                flexDirection: 'row',
              },
              children: [
                // Avatar placeholder
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '80px',
                      height: '80px',
                      borderRadius: '24px',
                      backgroundColor: '#F3F4F6',
                      border: '1px solid #E5E7EB',
                      marginRight: '24px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                    },
                    children: '👤'
                  }
                },
                // Content
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                    },
                    children: [
                      // Header
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  fontSize: '24px',
                                  fontWeight: 700,
                                  color: '#111827',
                                },
                                children: username
                              }
                            },
                            {
                              type: 'div',
                              props: {
                                style: {
                                  fontSize: '20px',
                                  color: '#6B7280',
                                },
                                children: 'Vừa xong'
                              }
                            }
                          ]
                        }
                      },
                      // Message
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '36px',
                            fontWeight: 700,
                            color: '#111827',
                            marginBottom: '32px',
                            lineHeight: 1.3,
                          },
                          children: message
                        }
                      },
                      // Badges
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '12px',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  padding: '8px 16px',
                                  backgroundColor: '#F3F4F6',
                                  color: '#6B7280',
                                  borderRadius: '12px',
                                  fontSize: '20px',
                                  fontWeight: 600,
                                },
                                children: `👏 ${achievement.cheers || 0}`
                              }
                            },
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  padding: '8px 16px',
                                  backgroundColor: '#EFF6FF', // blue bg
                                  color: '#1D4ED8', // blue text
                                  borderRadius: '12px',
                                  fontSize: '20px',
                                  fontWeight: 600,
                                },
                                children: achievement.habitName
                              }
                            },
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  padding: '8px 16px',
                                  backgroundColor: '#FEF2F2', // red bg
                                  color: '#B91C1C', // red text
                                  borderRadius: '12px',
                                  fontSize: '20px',
                                  fontWeight: 700,
                                },
                                children: `🔥 × ${achievement.streak}`
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    };

    const svg = await satori(element, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
      ],
    });

    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: 1200 },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(pngBuffer);
  } catch (err) {
    console.error('Error generating OG image:', err);
    res.status(500).send('Error generating image');
  }
});

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
    
    const title = `🔥 ${streak} ngày - ${habitName} | HabitFlow`;
    const description = `${username} vừa hoàn thành chuỗi ${streak} ngày thói quen "${habitName}". ${comment}`;
    
    // Fallback protocol to https if req.protocol is http but it's behind a proxy
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const ogImageUrl = `${protocol}://${req.get('host')}/api/achievements/${achievement.id}/og-image`;

    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    html = html.replace(/<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${title}" />`);
    html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta property="twitter:title" content="[^"]*" \/>/, `<meta property="twitter:title" content="${title}" />`);
    
    html = html.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`);
    html = html.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`);
    html = html.replace(/<meta property="twitter:description" content="[^"]*" \/>/, `<meta property="twitter:description" content="${description}" />`);
    
    html = html.replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${ogImageUrl}" />`);
    html = html.replace(/<meta property="twitter:image" content="[^"]*" \/>/, `<meta property="twitter:image" content="${ogImageUrl}" />`);

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

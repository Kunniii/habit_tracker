const { jwtVerify } = require('jose');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_here';
const secret = new TextEncoder().encode(JWT_SECRET);

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401);

  try {
    const { payload } = await jwtVerify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
}

module.exports = { authenticateToken, secret };

// COMP3123 Lab Exercise 10 - JWT Demo Backend
// Small Express API that issues real JSON Web Tokens (jsonwebtoken)
// and protects a /profile route with Bearer-token verification.

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Demo-only secret. In a real application this would live in an
// environment variable and never be committed to source control.
const JWT_SECRET = 'comp3123-lab10-demo-secret-do-not-use-in-production';
const TOKEN_EXPIRES_IN = '2m'; // short on purpose so expiry can be observed live

app.use(cors());
app.use(express.json());

// Demo user (fictional account, created only for this lab).
const DEMO_USER = {
  id: 1,
  name: 'Demo Student',
  email: 'demo@gbc.ca',
  password: 'password123', // plaintext only because this is a throwaway demo account
  program: 'COMP3123 - Full Stack Development I',
  semester: 'Fall 2026',
};

// POST /login -> verifies demo credentials and signs a JWT
app.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Payload: claims carried inside the token (never put passwords here!)
  const payload = {
    sub: DEMO_USER.id,
    name: DEMO_USER.name,
    email: DEMO_USER.email,
    role: 'student',
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

  return res.json({
    message: 'Login successful',
    token,
    tokenType: 'Bearer',
    expiresIn: TOKEN_EXPIRES_IN,
  });
});

// Auth middleware: requires a valid "Authorization: Bearer <token>" header
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      const msg =
        err.name === 'TokenExpiredError'
          ? 'Token has expired. Please log in again.'
          : 'Invalid token.';
      return res.status(401).json({ error: msg });
    }
    req.user = decoded; // decoded payload is attached to the request
    next();
  });
}

// GET /profile -> protected route, only reachable with a valid JWT
app.get('/profile', authenticateToken, (req, res) => {
  return res.json({
    message: 'Welcome to the protected profile route',
    profile: {
      id: DEMO_USER.id,
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      program: DEMO_USER.program,
      semester: DEMO_USER.semester,
    },
    tokenPayload: req.user, // what was decoded from the JWT
  });
});

app.get('/', (req, res) => {
  res.json({ status: 'JWT demo backend is running', endpoints: ['POST /login', 'GET /profile'] });
});

app.listen(PORT, () => {
  console.log(`JWT demo backend listening on http://localhost:${PORT}`);
});

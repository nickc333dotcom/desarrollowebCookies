const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Importar cookie-parser
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

// Middlewares
// 2. CORS ahora debe permitir credenciales
app.use(cors({
  origin: 'http://localhost:5500', 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); // Middleware para leer cookies

// Rutas
app.use('/api/auth', authRoutes);

// Ruta protegida de ejemplo
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Acceso concedido a contenido protegido',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// 4.  Middleware de autenticación para usar COOKIES
function authenticateToken(req, res, next) {
  
  const token = req.cookies.access_token; 

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado (cookie faltante)' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
}

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Autenticación',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      profile: 'GET /api/auth/me (requiere cookie)',
      protected: 'GET /api/protected (requiere cookie)'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
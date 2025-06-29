const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('./middleware/error');
const app = express();

// CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:5173', // Local development
    'https://shailendra-guidely.vercel.app', // Your actual Vercel domain
    'https://guidely.vercel.app' // Alternative domain if you change it
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.send('Guidely Backend API running!');
});

// Importing routes
const routesV1 = require('./routes/v1');
app.use('/api/v1', routesV1);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;

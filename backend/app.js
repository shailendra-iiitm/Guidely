const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('./middleware/error');
const app = express();

app.use(cors());
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

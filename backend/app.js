const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Guidely Backend API running!');
});

// Importing routes

const routesV1 = require('./routes/v1');
app.use('/api/v1', routesV1);


module.exports = app;

const express = require('express');
const cors = require('cors');
const healthRouter = require('./routes/health');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRouter);

module.exports = app;
const express = require('express');
const cors = require('cors');
const { clerkMiddleware } = require('./middleware/auth');
const healthRouter = require('./routes/health');
const workspacesRouter = require('./routes/workspaces');
const usersRouter = require('./routes/users');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Skip auth middleware in test environment
if (process.env.NODE_ENV !== 'test') {
  app.use(clerkMiddleware());
}

// Routes
app.use('/api/health', healthRouter);
app.use('/api/workspaces', workspacesRouter);
app.use('/api/users', usersRouter);

module.exports = app;
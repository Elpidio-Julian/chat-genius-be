const { clerkClient, clerkMiddleware, requireAuth } = require('@clerk/express');

// Custom middleware that allows requests to proceed with or without authentication
const withAuth = (req, res, next) => {
  const { userId } = req.auth;
  // If the user is not authenticated, return an empty object
  req.auth = userId ? req.auth : {};
  next();
};

// Custom middleware that requires authentication
const requireAuthMiddleware = (req, res, next) => {
  if (!req?.auth?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

module.exports = { 
  clerkClient,
  clerkMiddleware,
  requireAuth,
  withAuth,
  requireAuthMiddleware
};

import express from 'express';

export function createRouter() {
  const router = express.Router();

  // Add custom error handling middleware
  router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An unexpected error occurred' });
  });

  return router;
}

export function wrapAsync(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  };
}

import { APIError } from "../utils/errorHandler.js";

export const notFoundHandler = (req, res, next) => {
  const error = new APIError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof APIError) {
    res.status(err.status).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
  } else {
    res.status(500).json({
      message: 'An unexpected error occurred',
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
  }
};
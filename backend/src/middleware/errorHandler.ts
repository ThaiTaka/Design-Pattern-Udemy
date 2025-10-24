import { Request, Response, NextFunction } from 'express';
import Logger from '../patterns/singleton/Logger';

const logger = Logger.getInstance();

/**
 * Global Error Handler Middleware
 * Catches all errors and formats response
 */
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method
  });

  // Prisma errors
  if (error.code === 'P2002') {
    res.status(409).json({
      error: 'Resource already exists',
      details: error.meta
    });
    return;
  }

  if (error.code === 'P2025') {
    res.status(404).json({
      error: 'Resource not found'
    });
    return;
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation failed',
      details: error.details
    });
    return;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      error: 'Invalid token'
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'Token expired'
    });
    return;
  }

  // Default error
  res.status(error.statusCode || 500).json({
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
};

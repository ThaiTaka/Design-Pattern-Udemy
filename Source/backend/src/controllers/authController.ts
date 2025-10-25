import { Request, Response } from 'express';
import { UserFactory } from '../patterns/factory/UserFactory';
import { UserRepository } from '../patterns/repository/Repositories';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';

const userRepository = new UserRepository();

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;

    // Validate input
    UserFactory.validateUserData({ email, password, name });

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    // Create user based on role
    let userData;
    if (role === 'INSTRUCTOR') {
      userData = await UserFactory.createInstructor({
        email,
        password,
        name,
        bio: req.body.bio || 'Passionate educator'
      });
    } else {
      userData = await UserFactory.createStudent({ email, password, name });
    }

    const user = await userRepository.create(userData);

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      },
      token
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Validate password
    const isValid = await UserFactory.validatePassword(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      },
      token
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await userRepository.getUserWithEnrollments(req.user.id);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        enrollments: user.enrollments
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

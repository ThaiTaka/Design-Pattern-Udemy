import { Request, Response } from 'express';
import { CourseRepository, EnrollmentRepository, ReviewRepository } from '../patterns/repository/Repositories';
import { AuthRequest } from '../middleware/auth';
import CacheManager from '../patterns/singleton/CacheManager';
import EventBus from '../patterns/observer/EventBus';

const courseRepo = new CourseRepository();
const enrollmentRepo = new EnrollmentRepository();
const reviewRepo = new ReviewRepository();
const cache = CacheManager.getInstance();
const eventBus = EventBus.getInstance();

// GET /api/courses
export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, level, search, sort, page = '1', limit = '20' } = req.query;
    
    const cacheKey = `courses:${JSON.stringify(req.query)}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const courses = await courseRepo.findAll({
      category: category as string,
      level: level as string,
      search: search as string,
      sort: sort as any,
      skip,
      take: parseInt(limit as string)
    });

    const result = { courses, page: parseInt(page as string), limit: parseInt(limit as string) };
    await cache.set(cacheKey, result, 300);
    
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/courses/featured
export const getFeaturedCourses = async (_req: Request, res: Response): Promise<void> => {
  try {
    const cached = await cache.get('courses:featured');
    if (cached) {
      res.json(cached);
      return;
    }

    const courses = await courseRepo.findFeatured(6);
    await cache.set('courses:featured', courses, 600);
    
    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/courses/:slug
export const getCourseBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    
    const cached = await cache.get(`course:${slug}`);
    if (cached) {
      res.json(cached);
      return;
    }

    const course = await courseRepo.findBySlug(slug);
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const avgRating = await courseRepo.getAverageRating(course.id);
    const result = { ...course, avgRating };
    
    await cache.set(`course:${slug}`, result, 300);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/courses/:id/enroll
export const enrollCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    
    const existing = await enrollmentRepo.findByUserAndCourse(req.user.id, id);
    if (existing) {
      res.status(409).json({ error: 'Already enrolled in this course' });
      return;
    }

    const course = await courseRepo.findById(id);
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const enrollment = await enrollmentRepo.create({
      userId: req.user.id,
      courseId: id
    });

    await eventBus.emit('course:enrolled', {
      userId: req.user.id,
      courseId: id,
      courseName: course.title
    });

    await cache.deletePattern('courses:*');
    
    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/courses/:id/reviews
export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Rating must be between 1 and 5' });
      return;
    }

    const enrollment = await enrollmentRepo.findByUserAndCourse(req.user.id, id);
    if (!enrollment) {
      res.status(403).json({ error: 'Must be enrolled to review' });
      return;
    }

    const review = await reviewRepo.create({
      userId: req.user.id,
      courseId: id,
      rating,
      comment: comment || ''
    });

    await eventBus.emit('review:created', { courseId: id, rating, comment });
    await cache.deletePattern(`course:*`);

    res.status(201).json({ message: 'Review created', review });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

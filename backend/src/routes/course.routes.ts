import { Router } from 'express';
import {
  getAllCourses,
  getFeaturedCourses,
  getCourseBySlug,
  enrollCourse,
  createReview
} from '../controllers/courseController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getAllCourses);
router.get('/featured', getFeaturedCourses);
router.get('/:slug', getCourseBySlug);
router.post('/:id/enroll', authenticate, enrollCourse);
router.post('/:id/reviews', authenticate, createReview);

export default router;

import { PrismaClient, Course, User, Enrollment, Review } from '@prisma/client';
import DatabaseConnection from '../singleton/DatabaseConnection';

/**
 * REPOSITORY PATTERN
 * 
 * Purpose: Abstract data access layer, separating business logic from data persistence
 * Why: Direct database access in controllers/services creates tight coupling.
 * Repository pattern provides a clean interface for data operations.
 * 
 * Benefits:
 * - Centralized data access logic
 * - Easy to switch database (Prisma → TypeORM → Raw SQL)
 * - Testable (can mock repository)
 * - Consistent error handling
 * - Query optimization in one place
 * - Follow Single Responsibility Principle
 */

/**
 * Base Repository
 * Common CRUD operations for all entities
 */
abstract class BaseRepository<T> {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = DatabaseConnection.getInstance();
  }

  abstract create(data: any): Promise<T>;
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(options?: any): Promise<T[]>;
  abstract update(id: string, data: any): Promise<T>;
  abstract delete(id: string): Promise<boolean>;
}

/**
 * Course Repository
 * Handles all course-related database operations
 */
export class CourseRepository extends BaseRepository<Course> {
  async create(data: any): Promise<Course> {
    return this.prisma.course.create({ data });
  }

  async findById(id: string): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: { id: true, name: true, email: true, avatar: true, bio: true }
        },
        category: true,
        lessons: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { enrollments: true, reviews: true }
        }
      }
    });
  }

  async findBySlug(slug: string): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: {
          select: { id: true, name: true, email: true, avatar: true, bio: true }
        },
        category: true,
        lessons: {
          orderBy: { order: 'asc' }
        },
        reviews: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  async findAll(options: {
    skip?: number;
    take?: number;
    category?: string;
    level?: string;
    search?: string;
    sort?: 'popular' | 'newest' | 'price-low' | 'price-high';
  } = {}): Promise<Course[]> {
    const where: any = { isPublished: true };

    // Apply filters
    if (options.category) {
      where.categoryId = options.category;
    }

    if (options.level) {
      where.level = options.level;
    }

    if (options.search) {
      where.OR = [
        { title: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } }
      ];
    }

    // Determine sorting
    let orderBy: any = { createdAt: 'desc' };
    if (options.sort === 'popular') {
      orderBy = { enrollments: { _count: 'desc' } };
    } else if (options.sort === 'price-low') {
      orderBy = { price: 'asc' };
    } else if (options.sort === 'price-high') {
      orderBy = { price: 'desc' };
    }

    return this.prisma.course.findMany({
      where,
      orderBy,
      skip: options.skip || 0,
      take: options.take || 20,
      include: {
        instructor: {
          select: { id: true, name: true, avatar: true }
        },
        category: true,
        _count: {
          select: { enrollments: true, reviews: true }
        }
      }
    });
  }

  async findFeatured(limit: number = 6): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: { isPublished: true, isFeatured: true },
      take: limit,
      include: {
        instructor: {
          select: { id: true, name: true, avatar: true }
        },
        category: true,
        _count: {
          select: { enrollments: true }
        }
      }
    });
  }

  async update(id: string, data: any): Promise<Course> {
    return this.prisma.course.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.course.delete({ where: { id } });
    return true;
  }

  async getAverageRating(courseId: string): Promise<number> {
    const result = await this.prisma.review.aggregate({
      where: { courseId },
      _avg: { rating: true }
    });
    return result._avg.rating || 0;
  }
}

/**
 * User Repository
 * Handles all user-related database operations
 */
export class UserRepository extends BaseRepository<User> {
  async create(data: any): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
  }

  async findAll(options?: any): Promise<User[]> {
    return this.prisma.user.findMany(options);
  }

  async update(id: string, data: any): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.user.delete({ where: { id } });
    return true;
  }

  async getUserWithEnrollments(userId: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                instructor: {
                  select: { name: true, avatar: true }
                },
                category: true
              }
            }
          }
        }
      }
    });
  }
}

/**
 * Enrollment Repository
 * Handles course enrollment operations
 */
export class EnrollmentRepository extends BaseRepository<Enrollment> {
  async create(data: any): Promise<Enrollment> {
    return this.prisma.enrollment.create({ data });
  }

  async findById(id: string): Promise<Enrollment | null> {
    return this.prisma.enrollment.findUnique({
      where: { id },
      include: { course: true, user: true }
    });
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | null> {
    return this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      }
    });
  }

  async findAll(options?: any): Promise<Enrollment[]> {
    return this.prisma.enrollment.findMany(options);
  }

  async update(id: string, data: any): Promise<Enrollment> {
    return this.prisma.enrollment.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.enrollment.delete({ where: { id } });
    return true;
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: {
              select: { name: true, avatar: true }
            },
            category: true,
            lessons: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });
  }
}

/**
 * Review Repository
 * Handles review operations
 */
export class ReviewRepository extends BaseRepository<Review> {
  async create(data: any): Promise<Review> {
    return this.prisma.review.create({ data });
  }

  async findById(id: string): Promise<Review | null> {
    return this.prisma.review.findUnique({
      where: { id },
      include: { user: true, course: true }
    });
  }

  async findAll(options?: any): Promise<Review[]> {
    return this.prisma.review.findMany(options);
  }

  async update(id: string, data: any): Promise<Review> {
    return this.prisma.review.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.review.delete({ where: { id } });
    return true;
  }

  async getCourseReviews(courseId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { courseId },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

/**
 * Example Usage:
 * 
 * const courseRepo = new CourseRepository();
 * 
 * // Find all courses with filters
 * const courses = await courseRepo.findAll({
 *   category: 'programming',
 *   level: 'BEGINNER',
 *   search: 'React',
 *   sort: 'popular',
 *   take: 10
 * });
 * 
 * // Get course with full details
 * const course = await courseRepo.findBySlug('react-masterclass-123456');
 * 
 * // Easy to mock for testing
 * const mockRepo = {
 *   findById: jest.fn().mockResolvedValue(mockCourse)
 * };
 */

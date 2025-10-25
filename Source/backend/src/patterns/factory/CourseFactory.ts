import { Course, CourseLevel, Language } from '@prisma/client';

/**
 * FACTORY PATTERN - Course Factory
 * 
 * Purpose: Centralized object creation with validation and default values
 * Why: Creating courses requires complex initialization logic, validation,
 * and different configurations based on course type. The Factory Pattern
 * encapsulates this complexity.
 * 
 * Benefits:
 * - Centralizes object creation logic
 * - Ensures consistent object initialization
 * - Easy to extend with new course types
 * - Reduces code duplication
 * - Enforces business rules during creation
 */

export interface CourseData {
  title: string;
  description: string;
  price: number;
  level: CourseLevel;
  categoryId: string;
  instructorId: string;
  thumbnail?: string;
  language?: Language;
  discount?: number;
  isFeatured?: boolean;
}

export class CourseFactory {
  /**
   * Creates a standard video course
   * Most common course type with video lessons
   */
  public static createVideoCourse(data: CourseData): Omit<Course, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      ...this.getBaseFields(data),
      thumbnail: data.thumbnail || this.getDefaultThumbnail('video'),
      duration: 0, // Will be calculated when lessons are added
    };
  }

  /**
   * Creates a premium featured course
   * Highlighted on homepage with special badge
   */
  public static createFeaturedCourse(data: CourseData): Omit<Course, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      ...this.getBaseFields(data),
      thumbnail: data.thumbnail || this.getDefaultThumbnail('featured'),
      isFeatured: true,
      duration: 0,
    };
  }

  /**
   * Creates a free course for beginners
   * Great for marketing and user acquisition
   */
  public static createFreeCourse(data: Omit<CourseData, 'price'>): Omit<Course, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      ...this.getBaseFields({ ...data, price: 0 }),
      thumbnail: data.thumbnail || this.getDefaultThumbnail('free'),
      level: CourseLevel.BEGINNER,
      price: 0,
      discount: 0,
      duration: 0,
    };
  }

  /**
   * Creates a discounted course (sale/promotion)
   */
  public static createDiscountedCourse(
    data: CourseData,
    discountPercentage: number
  ): Omit<Course, 'id' | 'createdAt' | 'updatedAt'> {
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error('Discount must be between 0 and 100');
    }

    return {
      ...this.getBaseFields(data),
      thumbnail: data.thumbnail || this.getDefaultThumbnail('discount'),
      discount: discountPercentage,
      duration: 0,
    };
  }

  /**
   * Base fields shared by all course types
   * Centralizes common initialization logic
   */
  private static getBaseFields(data: CourseData): Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'duration'> {
    return {
      title: data.title.trim(),
      slug: this.generateSlug(data.title),
      description: data.description.trim(),
      price: Math.max(0, data.price), // Ensure non-negative
      discount: data.discount || 0,
      level: data.level,
      language: data.language || Language.ENGLISH,
      thumbnail: data.thumbnail || '',
      isPublished: true,
      isFeatured: data.isFeatured || false,
      instructorId: data.instructorId,
      categoryId: data.categoryId,
    };
  }

  /**
   * Generates URL-friendly slug from title
   * Example: "Learn React JS" -> "learn-react-js"
   */
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove duplicate hyphens
      + '-' + Date.now(); // Add timestamp for uniqueness
  }

  /**
   * Returns default thumbnail based on course type
   * In production, these would be actual image URLs
   */
  private static getDefaultThumbnail(type: string): string {
    const thumbnails: Record<string, string> = {
      video: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      featured: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
      free: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8',
      discount: 'https://images.unsplash.com/photo-1553877522-43269d4ea984',
    };
    return thumbnails[type] || thumbnails.video;
  }

  /**
   * Validates course data before creation
   * Throws error if validation fails
   */
  public static validateCourseData(data: CourseData): boolean {
    if (!data.title || data.title.length < 5) {
      throw new Error('Course title must be at least 5 characters');
    }
    if (!data.description || data.description.length < 20) {
      throw new Error('Course description must be at least 20 characters');
    }
    if (data.price < 0) {
      throw new Error('Course price cannot be negative');
    }
    if (!data.instructorId) {
      throw new Error('Instructor ID is required');
    }
    if (!data.categoryId) {
      throw new Error('Category ID is required');
    }
    return true;
  }
}

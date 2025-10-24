/**
 * DECORATOR PATTERN - Course Decorator
 * 
 * Purpose: Dynamically add features/behaviors to courses without modifying the base class
 * Why: We want to add features like discounts, featured badges, or certifications
 * to courses without creating multiple subclasses or modifying the original Course model.
 * 
 * Benefits:
 * - Add features dynamically at runtime
 * - Avoid class explosion (no need for DiscountedCourse, FeaturedCourse, etc.)
 * - Follow Open/Closed Principle (open for extension, closed for modification)
 * - Stack multiple decorators (e.g., featured + discounted)
 * - Easy to add new features without changing existing code
 * 
 * Real-world use case:
 * - Apply seasonal discounts
 * - Mark courses as "Featured" for homepage
 * - Add "Bestseller" or "New" badges
 * - Apply combo pricing
 */

export interface ICourse {
  id: string;
  title: string;
  price: number;
  discount: number;
  isFeatured: boolean;
  getDisplayPrice(): number;
  getDescription(): string;
  getBadges(): string[];
}

/**
 * Base Course Wrapper
 * Wraps Prisma Course model with additional methods
 */
export class CourseWrapper implements ICourse {
  constructor(
    public id: string,
    public title: string,
    public price: number,
    public discount: number = 0,
    public isFeatured: boolean = false,
    private description: string = ''
  ) {}

  getDisplayPrice(): number {
    return this.price - (this.price * this.discount / 100);
  }

  getDescription(): string {
    return this.description;
  }

  getBadges(): string[] {
    return [];
  }
}

/**
 * Abstract Decorator Base Class
 * All decorators extend this
 */
abstract class CourseDecorator implements ICourse {
  constructor(protected course: ICourse) {}

  get id() { return this.course.id; }
  get title() { return this.course.title; }
  get price() { return this.course.price; }
  get discount() { return this.course.discount; }
  get isFeatured() { return this.course.isFeatured; }

  getDisplayPrice(): number {
    return this.course.getDisplayPrice();
  }

  getDescription(): string {
    return this.course.getDescription();
  }

  getBadges(): string[] {
    return this.course.getBadges();
  }
}

/**
 * Discount Decorator
 * Adds additional discount to course (e.g., flash sale, coupon)
 */
export class DiscountDecorator extends CourseDecorator {
  constructor(course: ICourse, private additionalDiscount: number) {
    super(course);
    if (additionalDiscount < 0 || additionalDiscount > 100) {
      throw new Error('Discount must be between 0 and 100');
    }
  }

  getDisplayPrice(): number {
    const basePrice = super.getDisplayPrice();
    return basePrice - (basePrice * this.additionalDiscount / 100);
  }

  getDescription(): string {
    return `${super.getDescription()} 🔥 Extra ${this.additionalDiscount}% OFF!`;
  }

  getBadges(): string[] {
    return [...super.getBadges(), `${this.additionalDiscount}% OFF`];
  }
}

/**
 * Featured Decorator
 * Marks course as featured with special visibility
 */
export class FeaturedDecorator extends CourseDecorator {
  getDescription(): string {
    return `⭐ FEATURED: ${super.getDescription()}`;
  }

  getBadges(): string[] {
    return [...super.getBadges(), 'Featured'];
  }

  get isFeatured() {
    return true;
  }
}

/**
 * Bestseller Decorator
 * Adds bestseller badge (based on enrollment count)
 */
export class BestsellerDecorator extends CourseDecorator {
  constructor(course: ICourse, private enrollmentCount: number) {
    super(course);
  }

  getDescription(): string {
    return `🏆 BESTSELLER (${this.enrollmentCount.toLocaleString()} students): ${super.getDescription()}`;
  }

  getBadges(): string[] {
    return [...super.getBadges(), 'Bestseller'];
  }
}

/**
 * New Course Decorator
 * Highlights newly added courses
 */
export class NewCourseDecorator extends CourseDecorator {
  getDescription(): string {
    return `✨ NEW: ${super.getDescription()}`;
  }

  getBadges(): string[] {
    return [...super.getBadges(), 'New'];
  }
}

/**
 * Limited Time Decorator
 * Adds urgency with time-limited offer
 */
export class LimitedTimeDecorator extends CourseDecorator {
  constructor(course: ICourse, private expiryDate: Date) {
    super(course);
  }

  getDescription(): string {
    const daysLeft = Math.ceil((this.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return `⏰ ${daysLeft} DAYS LEFT: ${super.getDescription()}`;
  }

  getBadges(): string[] {
    return [...super.getBadges(), 'Limited Time'];
  }
}

/**
 * Example Usage:
 * 
 * const baseCourse = new CourseWrapper('1', 'React Course', 99, 0, false, 'Learn React');
 * 
 * // Add featured badge
 * const featured = new FeaturedDecorator(baseCourse);
 * 
 * // Add discount
 * const discounted = new DiscountDecorator(featured, 20);
 * 
 * // Stack multiple decorators
 * const finalCourse = new BestsellerDecorator(discounted, 5000);
 * 
 * console.log(finalCourse.getDisplayPrice()); // Original price with discount applied
 * console.log(finalCourse.getBadges()); // ['Featured', '20% OFF', 'Bestseller']
 * console.log(finalCourse.getDescription()); // Combined description with all badges
 */

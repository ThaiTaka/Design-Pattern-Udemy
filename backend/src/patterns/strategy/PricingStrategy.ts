/**
 * STRATEGY PATTERN - Pricing Strategy
 * 
 * Purpose: Define a family of pricing algorithms and make them interchangeable
 * Why: Different pricing models (regular, bulk discount, subscription) require
 * different calculation logic. Strategy pattern allows switching pricing logic
 * at runtime without conditional statements.
 * 
 * Benefits:
 * - Eliminates complex if/else chains
 * - Easy to add new pricing strategies
 * - Each strategy is independently testable
 * - Follows Open/Closed Principle
 * - Clean separation of concerns
 * 
 * Real-world use cases:
 * - Regular pricing: Pay per course
 * - Bulk discount: Buy multiple courses, get discount
 * - Subscription: Monthly/yearly unlimited access
 * - Corporate: Special enterprise pricing
 */

export interface PricingStrategy {
  calculatePrice(basePrice: number, quantity: number, metadata?: any): number;
  getDescription(): string;
}

/**
 * Regular Pricing Strategy
 * Simple per-course pricing
 */
export class RegularPricingStrategy implements PricingStrategy {
  calculatePrice(basePrice: number, quantity: number): number {
    return basePrice * quantity;
  }

  getDescription(): string {
    return 'Regular pricing - pay per course';
  }
}

/**
 * Bulk Discount Strategy
 * Apply discount based on quantity purchased
 * Example: 10% off for 3-5 courses, 20% off for 6+ courses
 */
export class BulkDiscountStrategy implements PricingStrategy {
  private discountTiers: { minQuantity: number; discount: number }[];

  constructor() {
    this.discountTiers = [
      { minQuantity: 6, discount: 20 },
      { minQuantity: 3, discount: 10 },
      { minQuantity: 1, discount: 0 },
    ];
  }

  calculatePrice(basePrice: number, quantity: number): number {
    const tier = this.discountTiers.find(t => quantity >= t.minQuantity) 
      || this.discountTiers[this.discountTiers.length - 1];
    
    const subtotal = basePrice * quantity;
    const discountAmount = subtotal * (tier.discount / 100);
    
    return subtotal - discountAmount;
  }

  getDescription(): string {
    return 'Bulk discount - save more when buying multiple courses';
  }
}

/**
 * Subscription Strategy
 * Fixed monthly/yearly fee for unlimited access
 */
export class SubscriptionStrategy implements PricingStrategy {
  constructor(
    private subscriptionPrice: number,
    private period: 'monthly' | 'yearly'
  ) {}

  calculatePrice(_basePrice: number, _quantity: number): number {
    // Subscription price is fixed regardless of quantity
    return this.subscriptionPrice;
  }

  getDescription(): string {
    return `${this.period === 'monthly' ? 'Monthly' : 'Yearly'} subscription - unlimited access`;
  }
}

/**
 * Coupon Discount Strategy
 * Apply coupon code discount
 */
export class CouponDiscountStrategy implements PricingStrategy {
  constructor(
    private couponCode: string,
    private discountPercentage: number,
    private maxDiscount?: number
  ) {}

  calculatePrice(basePrice: number, quantity: number): number {
    const subtotal = basePrice * quantity;
    let discountAmount = subtotal * (this.discountPercentage / 100);
    
    // Apply max discount cap if specified
    if (this.maxDiscount && discountAmount > this.maxDiscount) {
      discountAmount = this.maxDiscount;
    }
    
    return subtotal - discountAmount;
  }

  getDescription(): string {
    return `Coupon "${this.couponCode}" - ${this.discountPercentage}% off`;
  }
}

/**
 * Pricing Context
 * Uses a strategy to calculate prices
 */
export class PricingContext {
  private strategy: PricingStrategy;

  constructor(strategy: PricingStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PricingStrategy): void {
    this.strategy = strategy;
  }

  calculateTotal(basePrice: number, quantity: number, metadata?: any): {
    total: number;
    description: string;
  } {
    return {
      total: this.strategy.calculatePrice(basePrice, quantity, metadata),
      description: this.strategy.getDescription(),
    };
  }
}

/**
 * STRATEGY PATTERN - Search Strategy
 * 
 * Purpose: Different search algorithms for finding courses
 * Why: Users search in different ways (text search, filter by category,
 * sort by popularity). Each requires different query logic.
 */

export interface SearchStrategy {
  search(query: string, options?: any): Promise<any[]>;
  getType(): string;
}

/**
 * Text Search Strategy
 * Searches courses by title and description
 */
export class TextSearchStrategy implements SearchStrategy {
  async search(query: string): Promise<any[]> {
    console.log(`🔍 Searching by text: "${query}"`);
    // In real implementation, this would query database
    // Example: prisma.course.findMany({ where: { title: { contains: query } } })
    return [];
  }

  getType(): string {
    return 'text';
  }
}

/**
 * Category Filter Strategy
 * Filters courses by category
 */
export class CategoryFilterStrategy implements SearchStrategy {
  async search(categoryId: string): Promise<any[]> {
    console.log(`📁 Filtering by category: ${categoryId}`);
    // Example: prisma.course.findMany({ where: { categoryId } })
    return [];
  }

  getType(): string {
    return 'category';
  }
}

/**
 * Popularity Sort Strategy
 * Sorts courses by enrollment count
 */
export class PopularitySortStrategy implements SearchStrategy {
  async search(_query: string, options: { limit?: number } = {}): Promise<any[]> {
    console.log(`📊 Sorting by popularity, limit: ${options.limit || 'none'}`);
    // Example: prisma.course.findMany({ orderBy: { enrollments: { _count: 'desc' } } })
    return [];
  }

  getType(): string {
    return 'popularity';
  }
}

/**
 * Rating Sort Strategy
 * Sorts courses by average rating
 */
export class RatingSortStrategy implements SearchStrategy {
  async search(_query: string, options: { minRating?: number } = {}): Promise<any[]> {
    console.log(`⭐ Sorting by rating, minimum: ${options.minRating || 0}`);
    return [];
  }

  getType(): string {
    return 'rating';
  }
}

/**
 * Example Usage:
 * 
 * // Pricing
 * const regularPricing = new PricingContext(new RegularPricingStrategy());
 * console.log(regularPricing.calculateTotal(99, 1)); // $99
 * 
 * const bulkPricing = new PricingContext(new BulkDiscountStrategy());
 * console.log(bulkPricing.calculateTotal(99, 5)); // $445.50 (10% off)
 * 
 * const subscription = new PricingContext(new SubscriptionStrategy(29, 'monthly'));
 * console.log(subscription.calculateTotal(99, 100)); // $29 (unlimited for $29/month)
 * 
 * // Search
 * const textSearch = new TextSearchStrategy();
 * const results = await textSearch.search('React');
 */

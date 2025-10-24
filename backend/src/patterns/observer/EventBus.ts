/**
 * OBSERVER PATTERN - Event Bus
 * 
 * Purpose: Implement publish-subscribe pattern for decoupled event handling
 * Why: When actions happen (user enrolls, course purchased, etc.), multiple
 * systems need to respond (send email, update analytics, notify instructor).
 * Observer pattern decouples these dependencies.
 * 
 * Benefits:
 * - Loose coupling between components
 * - Easy to add new event handlers without modifying existing code
 * - Multiple observers can react to same event
 * - Centralized event management
 * - Easier to test individual components
 * 
 * Real-world use cases:
 * - User enrolls → Send welcome email + Update stats + Notify instructor
 * - Course completed → Issue certificate + Update profile + Trigger confetti
 * - Review submitted → Notify instructor + Update course rating + Moderate content
 */

type EventCallback = (data: any) => void | Promise<void>;

/**
 * Event Bus - Central event management system
 * Implements publish-subscribe (pub-sub) pattern
 */
class EventBus {
  private static instance: EventBus | null = null;
  private observers: Map<string, EventCallback[]>;

  private constructor() {
    this.observers = new Map();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribe to an event
   * @param event Event name (e.g., 'course:enrolled')
   * @param callback Function to call when event fires
   * @returns Unsubscribe function
   */
  public on(event: string, callback: EventCallback): () => void {
    if (!this.observers.has(event)) {
      this.observers.set(event, []);
    }
    
    this.observers.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.observers.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Publish an event
   * All subscribers will be notified
   * @param event Event name
   * @param data Data to pass to subscribers
   */
  public async emit(event: string, data: any): Promise<void> {
    const callbacks = this.observers.get(event);
    if (!callbacks || callbacks.length === 0) {
      return;
    }

    // Execute all callbacks (async supported)
    const promises = callbacks.map(callback => {
      try {
        return Promise.resolve(callback(data));
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
        return Promise.resolve();
      }
    });

    await Promise.all(promises);
  }

  /**
   * Remove all subscribers for an event
   */
  public off(event: string): void {
    this.observers.delete(event);
  }

  /**
   * Get subscriber count for an event
   */
  public getSubscriberCount(event: string): number {
    return this.observers.get(event)?.length || 0;
  }

  /**
   * Clear all subscribers (useful for testing)
   */
  public clear(): void {
    this.observers.clear();
  }
}

/**
 * Enrollment Event Observer
 * Handles all enrollment-related events
 */
export class EnrollmentObserver {
  private eventBus: EventBus;

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.setupListeners();
  }

  private setupListeners(): void {
    // When user enrolls in a course
    this.eventBus.on('course:enrolled', this.handleEnrollment.bind(this));
    
    // When user completes a course
    this.eventBus.on('course:completed', this.handleCompletion.bind(this));
    
    // When user progresses through lessons
    this.eventBus.on('lesson:completed', this.handleLessonCompletion.bind(this));
  }

  private async handleEnrollment(data: { userId: string; courseId: string; courseName: string }): Promise<void> {
    console.log(`📧 Sending welcome email for ${data.courseName}`);
    console.log(`📊 Updating enrollment statistics`);
    console.log(`🔔 Notifying instructor about new student`);
    
    // In production:
    // - await emailService.sendWelcomeEmail(data.userId, data.courseId);
    // - await analyticsService.trackEnrollment(data);
    // - await notificationService.notifyInstructor(data);
  }

  private async handleCompletion(data: { userId: string; courseId: string }): Promise<void> {
    console.log(`🎓 Generating certificate for course ${data.courseId}`);
    console.log(`✅ Marking course as completed`);
    console.log(`🎉 Triggering completion celebration`);
    
    // In production:
    // - await certificateService.generate(data.userId, data.courseId);
    // - await achievementService.unlockCompletionBadge(data.userId);
    // - await emailService.sendCongratulationsEmail(data.userId);
  }

  private async handleLessonCompletion(data: { userId: string; lessonId: string; progress: number }): Promise<void> {
    console.log(`📈 Updating progress: ${data.progress}%`);
    
    // Milestone achievements
    if (data.progress === 25) {
      console.log(`🏅 Achievement unlocked: 25% Progress`);
    } else if (data.progress === 50) {
      console.log(`🏅 Achievement unlocked: Halfway There`);
    } else if (data.progress === 75) {
      console.log(`🏅 Achievement unlocked: Almost Done`);
    }
  }
}

/**
 * Review Event Observer
 * Handles review-related events
 */
export class ReviewObserver {
  private eventBus: EventBus;

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.setupListeners();
  }

  private setupListeners(): void {
    this.eventBus.on('review:created', this.handleReviewCreated.bind(this));
  }

  private async handleReviewCreated(data: { courseId: string; rating: number; comment: string }): Promise<void> {
    console.log(`⭐ New ${data.rating}-star review for course ${data.courseId}`);
    console.log(`🔄 Recalculating course average rating`);
    console.log(`🔔 Notifying course instructor`);
    
    // If negative review, flag for moderation
    if (data.rating <= 2) {
      console.log(`⚠️ Low rating - flagged for moderation`);
    }
  }
}

export default EventBus;

/**
 * Example Usage:
 * 
 * // Setup observers (typically in app initialization)
 * const enrollmentObserver = new EnrollmentObserver();
 * const reviewObserver = new ReviewObserver();
 * 
 * // In your route handler
 * const eventBus = EventBus.getInstance();
 * 
 * // Emit event when user enrolls
 * await eventBus.emit('course:enrolled', {
 *   userId: 'user-123',
 *   courseId: 'course-456',
 *   courseName: 'React Masterclass'
 * });
 * 
 * // Multiple handlers will automatically respond
 */

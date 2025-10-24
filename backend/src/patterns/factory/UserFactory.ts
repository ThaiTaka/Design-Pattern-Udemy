import { User, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * FACTORY PATTERN - User Factory
 * 
 * Purpose: Creates different types of users (Student, Instructor, Admin)
 * with role-specific default values and permissions
 * 
 * Why: Different user types need different initialization:
 * - Students: Basic profile, no special permissions
 * - Instructors: Can create courses, needs bio
 * - Admins: Full system access, moderation capabilities
 * 
 * Benefits:
 * - Type-safe user creation
 * - Consistent password hashing
 * - Role-specific defaults
 * - Easy to extend with new user types
 */

export interface UserData {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export class UserFactory {
  /**
   * Creates a student account
   * Default role for new registrations
   */
  public static async createStudent(data: UserData): Promise<Omit<User, 'id' | 'createdAt' | 'updatedAt'>> {
    return {
      email: data.email.toLowerCase().trim(),
      password: await this.hashPassword(data.password),
      name: data.name.trim(),
      role: UserRole.STUDENT,
      avatar: data.avatar || this.getDefaultAvatar('student'),
      bio: data.bio || null,
    };
  }

  /**
   * Creates an instructor account
   * Can create and manage courses
   */
  public static async createInstructor(data: UserData & { bio: string }): Promise<Omit<User, 'id' | 'createdAt' | 'updatedAt'>> {
    if (!data.bio || data.bio.length < 50) {
      throw new Error('Instructor bio must be at least 50 characters');
    }

    return {
      email: data.email.toLowerCase().trim(),
      password: await this.hashPassword(data.password),
      name: data.name.trim(),
      role: UserRole.INSTRUCTOR,
      avatar: data.avatar || this.getDefaultAvatar('instructor'),
      bio: data.bio.trim(),
    };
  }

  /**
   * Creates an admin account
   * Full system access - use carefully!
   */
  public static async createAdmin(data: UserData): Promise<Omit<User, 'id' | 'createdAt' | 'updatedAt'>> {
    return {
      email: data.email.toLowerCase().trim(),
      password: await this.hashPassword(data.password),
      name: data.name.trim(),
      role: UserRole.ADMIN,
      avatar: data.avatar || this.getDefaultAvatar('admin'),
      bio: data.bio || 'Platform Administrator',
    };
  }

  /**
   * Hashes password using bcrypt
   * Salt rounds: 10 (good balance of security and performance)
   */
  private static async hashPassword(password: string): Promise<string> {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    return bcrypt.hash(password, 10);
  }

  /**
   * Validates password against hash
   */
  public static async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Returns default avatar URL based on user type
   */
  private static getDefaultAvatar(type: string): string {
    const avatars: Record<string, string> = {
      student: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
      instructor: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
      admin: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    };
    return avatars[type] || avatars.student;
  }

  /**
   * Validates email format
   */
  public static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates user data before creation
   */
  public static validateUserData(data: UserData): boolean {
    if (!this.validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    return true;
  }
}

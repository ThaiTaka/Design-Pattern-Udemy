import { PrismaClient } from '@prisma/client';

/**
 * SINGLETON PATTERN
 * 
 * Purpose: Ensures only ONE instance of PrismaClient exists throughout the application
 * Why: PrismaClient creates a connection pool. Multiple instances would create too many
 * database connections, leading to performance issues and potential connection limit errors.
 * 
 * Benefits:
 * - Single connection pool management
 * - Memory efficient
 * - Prevents connection leaks
 * - Thread-safe in Node.js event loop
 */
class DatabaseConnection {
  private static instance: PrismaClient | null = null;
  
  /**
   * Private constructor prevents direct instantiation
   * Forces use of getInstance() method
   */
  private constructor() {}

  /**
   * Returns the single instance of PrismaClient
   * Creates it lazily on first call
   */
  public static getInstance(): PrismaClient {
    if (!DatabaseConnection.instance) {
      console.log('🔌 Creating new Prisma Client instance...');
      
      DatabaseConnection.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' 
          ? ['query', 'error', 'warn'] 
          : ['error'],
      });

      // Graceful shutdown handling
      process.on('beforeExit', async () => {
        await DatabaseConnection.disconnect();
      });
    }
    
    return DatabaseConnection.instance;
  }

  /**
   * Disconnects from database
   * Used for cleanup during shutdown
   */
  public static async disconnect(): Promise<void> {
    if (DatabaseConnection.instance) {
      console.log('🔌 Disconnecting Prisma Client...');
      await DatabaseConnection.instance.$disconnect();
      DatabaseConnection.instance = null;
    }
  }

  /**
   * Health check - tests database connectivity
   */
  public static async healthCheck(): Promise<boolean> {
    try {
      const client = DatabaseConnection.getInstance();
      await client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('❌ Database health check failed:', error);
      return false;
    }
  }
}

export default DatabaseConnection;

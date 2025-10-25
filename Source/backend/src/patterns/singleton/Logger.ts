/**
 * SINGLETON PATTERN - Logger
 * 
 * Purpose: Centralized logging system with single instance
 * Why: Ensures consistent log formatting, prevents multiple log streams,
 * and provides a central point for log configuration
 * 
 * Benefits:
 * - Consistent log format across application
 * - Easy to switch log destinations (file, console, external service)
 * - Single configuration point
 * - Memory efficient
 */
class Logger {
  private static instance: Logger | null = null;
  private logLevel: 'debug' | 'info' | 'warn' | 'error';

  private constructor() {
    this.logLevel = (process.env.LOG_LEVEL as any) || 'info';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
  }

  public debug(message: string, meta?: any): void {
    if (this.logLevel === 'debug') {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }

  public info(message: string, meta?: any): void {
    if (['debug', 'info'].includes(this.logLevel)) {
      console.info(this.formatMessage('info', message, meta));
    }
  }

  public warn(message: string, meta?: any): void {
    if (['debug', 'info', 'warn'].includes(this.logLevel)) {
      console.warn(this.formatMessage('warn', message, meta));
    }
  }

  public error(message: string, meta?: any): void {
    console.error(this.formatMessage('error', message, meta));
  }

  public setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
    this.logLevel = level;
  }
}

export default Logger;

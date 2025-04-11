import { injectable } from 'inversify';
import { ILogger, LogLevel } from './logger.interface';

@injectable()
export class ConsoleLogger implements ILogger {
  private readonly isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV || false;
  }

  debug(message: string, context?: Record<string, any>): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, context);
    }
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    const errorContext = error
      ? {
          ...context,
          errorMessage: error.message,
          stack: error.stack,
          name: error.name,
        }
      : context;

    this.log(LogLevel.ERROR, message, errorContext);
  }

  log(level: LogLevel, message: string, context?: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, context || '');
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, context || '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, context || '');
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, context || '');
        break;
      default:
        console.log(formattedMessage, context || '');
    }
  }
} 
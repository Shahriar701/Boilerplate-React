import { injectable } from 'inversify';
import { ILoggerService } from './logger.interface';

@injectable()
export class ConsoleLoggerService implements ILoggerService {
    private readonly isDevelopment: boolean;

    constructor() {
        this.isDevelopment = import.meta.env.DEV || false;
    }

    info(message: string, ...args: any[]): void {
        console.info(`[INFO] ${message}`, ...args);
    }

    error(message: string, error?: Error | unknown): void {
        console.error(`[ERROR] ${message}`, error);
    }

    warn(message: string, ...args: any[]): void {
        console.warn(`[WARN] ${message}`, ...args);
    }

    debug(message: string, ...args: any[]): void {
        if (this.isDevelopment) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }
} 
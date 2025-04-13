import { injectable } from 'inversify';
import { IStorageService } from './storage.interface';

@injectable()
export class LocalStorageAdapter implements IStorageService {
  private readonly prefix = 'app_';

  get(key: string): string | null {
    try {
      return localStorage.getItem(this.getKeyWithPrefix(key));
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  }

  set(key: string, value: string): void {
    try {
      localStorage.setItem(this.getKeyWithPrefix(key), value);
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKeyWithPrefix(key));
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  }

  clear(): void {
    try {
      // Only clear items with our prefix
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }

  private getKeyWithPrefix(key: string): string {
    return `${this.prefix}${key}`;
  }
} 
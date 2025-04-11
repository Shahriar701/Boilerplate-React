import { injectable } from 'inversify';
import { IStorageAdapter } from '../../infrastructure/storage/storage.interface';

@injectable()
export class LocalStorageAdapter implements IStorageAdapter {
  get<T = any>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error retrieving ${key} from localStorage:`, error);
      return null;
    }
  }

  set(key: string, value: any): void {
    try {
      const stringValue = JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  has(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error checking if ${key} exists in localStorage:`, error);
      return false;
    }
  }
} 
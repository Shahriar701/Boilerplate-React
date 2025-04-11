export interface IStorageAdapter {
  get<T = any>(key: string): T | null;
  set(key: string, value: any): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
} 
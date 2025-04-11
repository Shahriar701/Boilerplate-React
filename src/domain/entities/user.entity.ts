export interface UserRole {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  roles: UserRole[];
  profileImageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity implements User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  roles: UserRole[];
  profileImageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.roles = user.roles;
    this.profileImageUrl = user.profileImageUrl;
    this.isActive = user.isActive;
    this.createdAt = new Date(user.createdAt);
    this.updatedAt = new Date(user.updatedAt);
  }

  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.username;
  }

  get initials(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
    }
    return this.username.substring(0, 2).toUpperCase();
  }

  hasRole(roleName: string): boolean {
    return this.roles.some(role => role.name === roleName);
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }
} 
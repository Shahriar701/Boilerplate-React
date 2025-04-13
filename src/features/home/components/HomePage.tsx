import React from 'react';
import { Link } from 'react-router-dom';
import { useInjection } from 'inversify-react';
import { TYPES } from '../../../app/config/types';
import { IAuthService } from '../../../features/auth/services/auth.service.interface';
import './HomePage.css';

const HomePage: React.FC = () => {
    const authService = useInjection<IAuthService>(TYPES.AuthService);
    const isAuthenticated = authService.isAuthenticated();

    return (
        <div className="home-page">
            <section className="hero">
                <h1>Welcome to React Boilerplate</h1>
                <p className="hero-text">
                    A modern, robust TypeScript React frontend with Clean Architecture, SOLID principles,
                    and Dependency Injection.
                </p>

                {!isAuthenticated && (
                    <div className="hero-actions">
                        <Link to="/login" className="btn-primary">
                            Login
                        </Link>
                        <Link to="/register" className="btn-outline">
                            Register
                        </Link>
                    </div>
                )}

                {isAuthenticated && (
                    <div className="hero-actions">
                        <Link to="/products" className="btn-primary">
                            Browse Products
                        </Link>
                        <Link to="/profile" className="btn-outline">
                            View Profile
                        </Link>
                    </div>
                )}
            </section>

            <section className="features">
                <h2>Key Features</h2>

                <div className="feature-list">
                    <div className="feature-card">
                        <h3>Clean Architecture</h3>
                        <p>
                            Organized in layers that separate concerns and dependencies, making the code more maintainable.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Dependency Injection</h3>
                        <p>
                            Using InversifyJS for IoC container to handle dependencies and promote loose coupling.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Type Safety</h3>
                        <p>
                            Strong typing with TypeScript for better developer experience and fewer runtime errors.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Feature-Based Organization</h3>
                        <p>
                            Code is organized by features rather than technical layers for better scalability.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage; 
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useInjection } from 'inversify-react';
import { TYPES } from '../../app/config/types';
import { IAuthService } from '../../features/auth/services/auth.service.interface';
import './Navigation.css';

const Navigation: React.FC = () => {
    const authService = useInjection<IAuthService>(TYPES.AuthService);
    const isAuthenticated = authService.isAuthenticated();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    return (
        <nav className="main-nav">
            <div className="nav-brand">
                <NavLink to="/">React Boilerplate</NavLink>
            </div>

            <div className="nav-links">
                <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                    Home
                </NavLink>

                {isAuthenticated ? (
                    <>
                        <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
                            Products
                        </NavLink>

                        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                            Profile
                        </NavLink>

                        <button className="nav-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>
                            Login
                        </NavLink>

                        <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}>
                            Register
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navigation; 
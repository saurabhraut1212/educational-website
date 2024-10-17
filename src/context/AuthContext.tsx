import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

interface AuthContextType {
    isAuthenticated: boolean;
    currentUserId: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);


    useEffect(() => {
        const token = localStorage.getItem('utoken');
        if (token) {
            try {
                const decodedToken: { id: string } = jwtDecode(token);
                setCurrentUserId(decodedToken.id);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error decoding token', error);
                setIsAuthenticated(false);
                setCurrentUserId(null);
            }
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('utoken', token);
        const decodedToken: { id: string } = jwtDecode(token);
        setCurrentUserId(decodedToken.id);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('utoken');
        setCurrentUserId(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, currentUserId, login,   logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

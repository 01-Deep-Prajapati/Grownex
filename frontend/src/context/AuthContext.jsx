import { de } from 'date-fns/locale';
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const updateUserData = (newUserData) => {
        if (user && user.token) {
            const updatedUser = {
                token: user.token,
                user: { ...user.user, ...newUserData }
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser.user));
        }
    };

    const login = (userData) => {
        // Store both token and user data
        setUser(userData);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData.user));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    // Check token and validate on app startup
    useEffect(() => {
        const validateToken = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (token) {
                try {
                    // First set the stored user data if available
                    if (storedUser) {
                        setUser({ token, user: JSON.parse(storedUser) });
                    }
                    // Then validate and update with fresh data
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/validate`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const userData = { token, user: response.data };
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(response.data));
                } catch (error) {
                    console.error('Token validation failed:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                    navigate('/');
                }
            }
            setLoading(false);
        };
        validateToken();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUserData, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
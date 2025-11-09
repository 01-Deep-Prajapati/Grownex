import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleHome = () => {
        navigate('/feed');
    };

    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 fixed w-full top-0 z-10 shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <button
                            onClick={handleHome}
                            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                        >
                            Grownex
                        </button>
                        <div className="hidden md:flex space-x-6">
                            <button
                                onClick={handleHome}
                                className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Home
                            </button>
                            <button
                                onClick={() => navigate('/profile')}
                                className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Profile
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
                        >
                            {user?.user ? (
                                user.user.profileImage ? (
                                    <img
                                        src={user.user.profileImage}
                                        alt={user.user.name}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                                        {user.user.name.charAt(0).toUpperCase()}
                                    </div>
                                )
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white"></div>
                            )}
                            <span className="text-gray-700 font-medium hidden sm:inline">
                                {user?.user?.name}
                            </span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium rounded-lg text-red-600 hover:text-white border border-red-600 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all duration-300"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
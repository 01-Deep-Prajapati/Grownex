import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const Layout = ({ children }) => {
    const { user, loading } = useAuth();
    const isLoginPage = window.location.pathname === '/';

    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        {!loading && !isLoginPage && user && <Header />}
        <main className={`flex-grow ${!isLoginPage && user ? 'pt-16' : ''}`}>
          {children}
        </main>
        {!loading && !isLoginPage && user && <Footer />}
      </div>
    );
  };
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/feed" element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;

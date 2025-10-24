import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/useStore';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold gradient-text">ELearn</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/courses" className="hover:text-blue-600 transition">Courses</Link>
            {isAuthenticated() ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                <button onClick={logout} className="hover:text-blue-600 transition">Logout</button>
                <div className="flex items-center space-x-2">
                  <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full" />
                  <span>{user?.name}</span>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-600 transition">Login</Link>
                <Link to="/register" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden mt-4 space-y-4"
          >
            <Link to="/courses" className="block">Courses</Link>
            {isAuthenticated() ? (
              <>
                <Link to="/dashboard" className="block">Dashboard</Link>
                <button onClick={logout} className="block">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block">Login</Link>
                <Link to="/register" className="block">Sign Up</Link>
              </>
            )}
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;

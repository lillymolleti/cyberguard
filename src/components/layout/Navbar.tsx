import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, Shield, Home, BookOpen, BrainCircuit, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  const handleLogout = async () => {
    await logout();
    closeMenu();
  };
  
  // Skip the navbar on login and registration pages
  if (location.pathname === '/' || location.pathname === '/register') {
    return null;
  }
  
  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/flashcards', label: 'Flashcards', icon: <BookOpen size={20} /> },
    { path: '/quiz', label: 'Quiz', icon: <BrainCircuit size={20} /> },
  ];
  
  const isActivePath = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">CyberGuard</span>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
                    isActivePath(link.path)
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-1">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:flex sm:items-center">
            <span className="text-sm text-gray-600 mr-4">
              {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
            >
              <LogOut size={16} className="mr-1" />
              Sign out
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium focus:outline-none transition duration-150 ease-in-out ${
                isActivePath(link.path)
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </div>
            </Link>
          ))}
          
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {user?.name?.[0] || user?.email?.[0] || '?'}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.name}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:text-gray-800 focus:bg-gray-100 transition duration-150 ease-in-out"
              >
                <div className="flex items-center">
                  <LogOut size={20} className="mr-2" />
                  Sign out
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter';
import PasswordGenerator from '../components/auth/PasswordGenerator';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [formError, setFormError] = useState('');
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormError('');
    clearError();
    
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handlePasswordSelect = (generatedPassword: string) => {
    setPassword(generatedPassword);
    setShowGenerator(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-4 md:p-6 text-center">
          <div className="flex justify-center mb-2">
            <Shield size={36} className="text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">CyberGuard</h1>
          <p className="text-indigo-200 mt-1">Your cybersecurity learning platform</p>
        </div>
        
        <div className="p-4 md:p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>
          
          {(error || formError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
              <AlertCircle size={20} className="text-red-500 mr-2 flex-shrink-0" />
              <span>{error || formError}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your full name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                  onClick={() => setShowGenerator(!showGenerator)}
                >
                  {showGenerator ? "Hide generator" : "Generate strong password"}
                </button>
              </div>
              
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {password && <PasswordStrengthMeter password={password} />}
              
              {showGenerator && (
                <div className="mt-4">
                  <PasswordGenerator onSelect={handlePasswordSelect} />
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Sign Up
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
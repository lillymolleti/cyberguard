import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-indigo-600">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2">The page you're looking for doesn't exist or has been moved.</p>
        
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <HomeIcon size={18} className="mr-2" />
            Back to Home
          </Link>
          
          <button 
            onClick={() => history.back()}
            className="flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
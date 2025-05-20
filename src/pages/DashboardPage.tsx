import Navbar from '../components/layout/Navbar';
import DashboardStats from '../components/dashboard/DashboardStats';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { BookOpen, BrainCircuit, Shield, ChevronRight } from 'lucide-react';

// Temporary mock data
const mockStats = {
  quizzesCompleted: 3,
  flashcardsReviewed: 24,
  totalScore: 85,
  streak: 4
};

const mockRecentFlashcards = [
  { id: '1', title: 'Two-Factor Authentication', lastReviewed: '2 days ago' },
  { id: '2', title: 'Common Phishing Techniques', lastReviewed: '3 days ago' },
  { id: '3', title: 'Password Hashing', lastReviewed: '5 days ago' },
];

const mockRecentQuizzes = [
  { id: '1', title: 'Phishing Prevention', score: '85%', completed: '1 day ago' },
  { id: '2', title: 'Network Security Basics', score: '75%', completed: '4 days ago' },
];

interface ActivityItem {
  id: string;
  type: 'flashcard' | 'quiz';
  title: string;
  timestamp: string;
  details: string;
}

// Mock activity feed
const mockActivityFeed: ActivityItem[] = [
  { id: '1', type: 'quiz', title: 'Phishing Prevention Quiz', timestamp: '1 day ago', details: 'Scored 85%' },
  { id: '2', type: 'flashcard', title: 'Two-Factor Authentication', timestamp: '2 days ago', details: 'Reviewed 5 cards' },
  { id: '3', type: 'quiz', title: 'Network Security Basics', timestamp: '4 days ago', details: 'Scored 75%' },
  { id: '4', type: 'flashcard', title: 'Common Phishing Techniques', timestamp: '5 days ago', details: 'Reviewed 8 cards' },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(mockStats);
  const [recentFlashcards, setRecentFlashcards] = useState(mockRecentFlashcards);
  const [recentQuizzes, setRecentQuizzes] = useState(mockRecentQuizzes);
  const [activityFeed, setActivityFeed] = useState(mockActivityFeed);

  // Simulating data fetch from API
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // Example:
    // const fetchData = async () => {
    //   const statsResponse = await fetch('/api/user/stats');
    //   const statsData = await statsResponse.json();
    //   setStats(statsData);
    //   ...
    // };
    // fetchData();

    // Instead, we'll use our mock data
    setStats(mockStats);
    setRecentFlashcards(mockRecentFlashcards);
    setRecentQuizzes(mockRecentQuizzes);
    setActivityFeed(mockActivityFeed);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}</h1>
          <p className="text-gray-600">Track your progress and continue your cybersecurity journey.</p>
        </div>
        
        {/* Stats */}
        <section className="mb-8">
          <DashboardStats stats={stats} />
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Path */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                <h2 className="text-lg font-medium text-white">Your Cybersecurity Learning Path</h2>
              </div>
              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Flashcards Section */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <BookOpen className="text-blue-600 mr-2" size={24} />
                      <h3 className="text-lg font-medium text-gray-800">Flashcards</h3>
                    </div>
                    <div className="space-y-3">
                      {recentFlashcards.map(flashcard => (
                        <div key={flashcard.id} className="flex items-center justify-between p-2 bg-white rounded-md hover:bg-blue-50 transition-colors">
                          <span className="text-gray-700">{flashcard.title}</span>
                          <span className="text-xs text-gray-500">{flashcard.lastReviewed}</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/flashcards" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800">
                      View all flashcards
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                  
                  {/* Quizzes Section */}
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <BrainCircuit className="text-indigo-600 mr-2" size={24} />
                      <h3 className="text-lg font-medium text-gray-800">Quizzes</h3>
                    </div>
                    <div className="space-y-3">
                      {recentQuizzes.map(quiz => (
                        <div key={quiz.id} className="flex items-center justify-between p-2 bg-white rounded-md hover:bg-indigo-50 transition-colors">
                          <span className="text-gray-700">{quiz.title}</span>
                          <div className="text-right">
                            <span className="block text-sm font-medium text-gray-900">{quiz.score}</span>
                            <span className="block text-xs text-gray-500">{quiz.completed}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link to="/quiz" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800">
                      Take a quiz
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
                
                {/* Learning Recommendations */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Recommended Next Steps</h3>
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Shield className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-green-800">Continue learning about Password Security</h4>
                        <p className="mt-1 text-sm text-green-700">
                          Based on your progress, we recommend reviewing password security best practices.
                        </p>
                        <div className="mt-2">
                          <Link to="/flashcards" className="text-sm font-medium text-green-700 hover:text-green-600">
                            Review flashcards <span aria-hidden="true">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Activity Feed */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
              <div className="px-6 py-4 bg-gray-800">
                <h2 className="text-lg font-medium text-white">Recent Activity</h2>
              </div>
              <div className="p-4">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {activityFeed.map((activity, index) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {index !== activityFeed.length - 1 && (
                            <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                          )}
                          <div className="relative flex items-start space-x-3">
                            <div className="relative">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                activity.type === 'quiz' ? 'bg-indigo-100' : 'bg-blue-100'
                              }`}>
                                {activity.type === 'quiz' ? (
                                  <BrainCircuit size={20} className="text-indigo-600" />
                                ) : (
                                  <BookOpen size={20} className="text-blue-600" />
                                )}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {activity.title}
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">
                                  {activity.timestamp}
                                </p>
                              </div>
                              <div className="mt-1 text-sm text-gray-700">
                                {activity.details}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2 text-sm">
                  <a href="#" className="font-medium text-gray-700 hover:text-gray-900">
                    View all activity <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
import { Trophy, BookOpen, Brain, Star } from 'lucide-react';

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  description: string;
  color: string;
}

const StatsCard = ({ icon, title, value, description, color }: StatsCardProps) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
    <div className={`p-4 ${color} text-white flex items-center justify-center`}>
      {icon}
    </div>
    <div className="p-5">
      <h3 className="font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  </div>
);

interface DashboardStatsProps {
  stats: {
    quizzesCompleted: number;
    flashcardsReviewed: number;
    totalScore: number;
    streak: number;
  };
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatsCard
        icon={<Trophy size={28} />}
        title="Quizzes Completed"
        value={stats.quizzesCompleted}
        description="Keep testing your knowledge!"
        color="bg-blue-500"
      />
      <StatsCard
        icon={<BookOpen size={28} />}
        title="Flashcards Reviewed"
        value={stats.flashcardsReviewed}
        description="Practice makes perfect"
        color="bg-indigo-500"
      />
      <StatsCard
        icon={<Brain size={28} />}
        title="Average Score"
        value={`${stats.totalScore}%`}
        description="Your quiz performance"
        color="bg-green-500"
      />
      <StatsCard
        icon={<Star size={28} />}
        title="Current Streak"
        value={stats.streak}
        description="Days in a row"
        color="bg-amber-500"
      />
    </div>
  );
};

export default DashboardStats;
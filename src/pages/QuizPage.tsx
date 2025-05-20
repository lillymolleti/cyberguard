import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import QuizQuestion, { QuizQuestionData } from '../components/quiz/QuizQuestion';
import { BrainCircuit, Check, AlertTriangle, ArrowRight } from 'lucide-react';

// Mock quiz data
const CYBERSECURITY_QUIZ: QuizQuestionData[] = [
  {
    id: '1',
    question: 'Which of the following is NOT typically considered a factor in multi-factor authentication?',
    options: [
      'Something you know (password)',
      'Something you have (security key)',
      'Something you are (biometrics)',
      'Something you\'ve done (browsing history)'
    ],
    correctAnswer: 3,
    explanation: 'Multi-factor authentication typically uses combinations of something you know (passwords), something you have (security keys or mobile devices), and something you are (biometrics like fingerprints). Browsing history is not a standard authentication factor.'
  },
  {
    id: '2',
    question: 'What is the primary purpose of password hashing?',
    options: [
      'To make passwords easier to remember',
      'To encrypt passwords for secure transmission',
      'To store passwords in a way that can\'t be reversed',
      'To generate random passwords'
    ],
    correctAnswer: 2,
    explanation: 'Password hashing converts passwords into fixed-length strings that cannot be reversed back to the original password. This means that even if a database is compromised, the actual passwords remain protected.'
  },
  {
    id: '3',
    question: 'Which of the following is a common indicator of a phishing attempt?',
    options: [
      'Emails from people in your contact list',
      'Urgent requests for personal information',
      'Links that match the official company domain',
      'Properly signed digital certificates'
    ],
    correctAnswer: 1,
    explanation: 'Urgent requests for personal information are a classic sign of phishing. Legitimate organizations rarely request sensitive information via email or urgent messages.'
  },
  {
    id: '4',
    question: 'What is a zero-day vulnerability?',
    options: [
      'A vulnerability that has existed for less than 24 hours',
      'A vulnerability that can be exploited immediately with 100% success',
      'A vulnerability that has been fixed for exactly zero days',
      'A vulnerability unknown to the software vendor that attackers can exploit'
    ],
    correctAnswer: 3,
    explanation: 'A zero-day vulnerability is a software security flaw that is unknown to the parties responsible for patching it. Attackers can exploit these vulnerabilities before developers have had an opportunity to create a patch to fix it.'
  },
  {
    id: '5',
    question: 'Which password is most secure?',
    options: [
      'password123',
      'MySuperSecretPassword',
      'P@$$w0rd',
      'kT9Qr*bW2@pL7zXn'
    ],
    correctAnswer: 3,
    explanation: 'The last option is most secure because it contains a long string of random uppercase and lowercase letters, numbers, and special characters with no recognizable words or patterns.'
  },
  {
    id: '6',
    question: 'What does ransomware typically do?',
    options: [
      'Steals computing resources to mine cryptocurrency',
      'Encrypts files and demands payment for decryption',
      'Collects user data to sell to advertisers',
      'Slows down the computer to force an upgrade purchase'
    ],
    correctAnswer: 1,
    explanation: 'Ransomware is malicious software that encrypts a victim\'s files, making them inaccessible. The attacker then demands a ransom payment to restore access to the data.'
  },
  {
    id: '7',
    question: 'What is the purpose of a VPN (Virtual Private Network)?',
    options: [
      'To speed up internet connections',
      'To block all advertisements',
      'To encrypt internet traffic and hide IP addresses',
      'To provide free access to premium content'
    ],
    correctAnswer: 2,
    explanation: 'A VPN creates an encrypted tunnel for your internet traffic, protecting your data from eavesdropping and masking your IP address and location for greater privacy.'
  },
  {
    id: '8',
    question: 'What is the best practice for creating passwords across multiple accounts?',
    options: [
      'Use variations of the same password so they\'re easy to remember',
      'Use one very complex password for all accounts',
      'Use unique, strong passwords for each account with a password manager',
      'Change all passwords on the same day each month'
    ],
    correctAnswer: 2,
    explanation: 'Using unique, strong passwords for each account is the best practice. A password manager helps generate and store these complex passwords securely, eliminating the need to remember them all.'
  }
];

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<string, boolean>>(new Map());
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0, percentage: 0 });
  
  const handleAnswer = (questionId: string, isCorrect: boolean) => {
    // Update answers map
    const newAnswers = new Map(userAnswers);
    newAnswers.set(questionId, isCorrect);
    setUserAnswers(newAnswers);
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < CYBERSECURITY_QUIZ.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        finishQuiz();
      }
    }, 1500);
  };
  
  const finishQuiz = () => {
    setQuizComplete(true);
    
    // Calculate score
    let correctCount = 0;
    userAnswers.forEach((isCorrect) => {
      if (isCorrect) correctCount++;
    });
    
    const totalQuestions = CYBERSECURITY_QUIZ.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    setScore({
      correct: correctCount,
      total: totalQuestions,
      percentage
    });
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setQuizComplete(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BrainCircuit className="mr-2 text-indigo-600" size={28} />
            Cybersecurity Knowledge Quiz
          </h1>
          <p className="text-gray-600">
            Test your understanding of cybersecurity concepts and best practices.
          </p>
        </div>
        
        {!quizComplete ? (
          <>
            {/* Progress indicator */}
            <div className="mb-4">
              <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                <span>Question {currentQuestionIndex + 1} of {CYBERSECURITY_QUIZ.length}</span>
                <span>{userAnswers.size} answered</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / CYBERSECURITY_QUIZ.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Current question */}
            <QuizQuestion 
              question={CYBERSECURITY_QUIZ[currentQuestionIndex]}
              onAnswer={handleAnswer}
              showResult={userAnswers.has(CYBERSECURITY_QUIZ[currentQuestionIndex].id)}
            />
            
            {/* Navigation buttons */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 rounded-md ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              <button
                onClick={() => {
                  if (currentQuestionIndex < CYBERSECURITY_QUIZ.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  } else {
                    finishQuiz();
                  }
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              >
                {currentQuestionIndex === CYBERSECURITY_QUIZ.length - 1 ? 'Finish Quiz' : 'Skip Question'}
                <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
          </>
        ) : (
          /* Quiz results */
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-center mb-6">Quiz Results</h2>
            
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full flex items-center justify-center border-8 border-indigo-100">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-indigo-600">{score.percentage}%</span>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-lg">
                You answered <span className="font-bold text-indigo-600">{score.correct}</span> out of <span className="font-bold">{score.total}</span> questions correctly.
              </p>
              
              {score.percentage >= 70 ? (
                <div className="mt-2 flex items-center justify-center text-green-600">
                  <Check size={20} className="mr-1" />
                  <span>Great job! You have a solid understanding of cybersecurity concepts.</span>
                </div>
              ) : (
                <div className="mt-2 flex items-center justify-center text-amber-600">
                  <AlertTriangle size={20} className="mr-1" />
                  <span>You might want to review the flashcards to strengthen your knowledge.</span>
                </div>
              )}
            </div>
            
            {/* Question summary */}
            <div className="mt-8">
              <h3 className="font-medium text-lg mb-4">Question Summary</h3>
              
              <div className="space-y-2">
                {CYBERSECURITY_QUIZ.map((question, index) => {
                  const isAnsweredCorrectly = userAnswers.get(question.id);
                  
                  return (
                    <div 
                      key={question.id}
                      className={`p-3 border rounded-md ${
                        isAnsweredCorrectly === undefined
                          ? 'border-gray-200 bg-gray-50'
                          : isAnsweredCorrectly
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">Question {index + 1}</span>
                        {isAnsweredCorrectly !== undefined && (
                          <span className={isAnsweredCorrectly ? 'text-green-600' : 'text-red-600'}>
                            {isAnsweredCorrectly ? 'Correct' : 'Incorrect'}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-700">{question.question}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={resetQuiz}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Take Quiz Again
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizPage;
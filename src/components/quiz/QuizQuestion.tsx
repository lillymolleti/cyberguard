import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface QuizQuestionData {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizQuestionProps {
  question: QuizQuestionData;
  onAnswer: (questionId: string, isCorrect: boolean) => void;
  showResult: boolean;
}

const QuizQuestion = ({ question, onAnswer, showResult }: QuizQuestionProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null || showResult) return; // Prevent changing answer
    
    setSelectedOption(optionIndex);
    const correct = optionIndex === question.correctAnswer;
    setIsCorrect(correct);
    onAnswer(question.id, correct);
  };

  const getOptionClasses = (index: number) => {
    let classes = "p-3 mb-2 rounded-lg border-2 transition-all duration-300 ";
    
    if (selectedOption === null && !showResult) {
      return classes + "border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer";
    }
    
    if (showResult || selectedOption !== null) {
      if (index === question.correctAnswer) {
        return classes + "border-green-300 bg-green-50";
      } else if (selectedOption === index) {
        return classes + "border-red-300 bg-red-50";
      }
    }
    
    return classes + "border-gray-200 opacity-70";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-medium text-gray-800 mb-4">{question.question}</h3>
      
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <div 
            key={index}
            className={getOptionClasses(index)}
            onClick={() => handleOptionSelect(index)}
          >
            <div className="flex items-start">
              <div className="flex-1">
                {option}
              </div>
              
              {/* Show indicators only if this option is selected or it's the correct answer when showing results */}
              {showResult && index === question.correctAnswer && (
                <CheckCircle2 className="ml-2 text-green-500 flex-shrink-0" size={20} />
              )}
              {showResult && selectedOption === index && index !== question.correctAnswer && (
                <XCircle className="ml-2 text-red-500 flex-shrink-0" size={20} />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Explanation section */}
      {(showResult || selectedOption !== null) && (
        <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </p>
          <p className="mt-1 text-gray-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
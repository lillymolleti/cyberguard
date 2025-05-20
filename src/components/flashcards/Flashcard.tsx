import { useState, useRef, useEffect } from 'react';

interface FlashcardProps {
  id: string;
  front: string;
  back: string;
  onFlip?: (id: string, isFlipped: boolean) => void;
}

const Flashcard = ({ id, front, back, onFlip }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [height, setHeight] = useState('auto');
  
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateHeight = () => {
      const frontHeight = frontRef.current?.offsetHeight || 0;
      const backHeight = backRef.current?.offsetHeight || 0;
      setHeight(`${Math.max(frontHeight, backHeight, 200)}px`);
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    
    // Sometimes content loads after component mounts, so we need to check again
    const timer = setTimeout(calculateHeight, 100);
    
    return () => {
      window.removeEventListener('resize', calculateHeight);
      clearTimeout(timer);
    };
  }, [front, back]);

  const handleFlip = () => {
    const newFlipState = !isFlipped;
    setIsFlipped(newFlipState);
    if (onFlip) {
      onFlip(id, newFlipState);
    }
  };

  return (
    <div 
      className="cursor-pointer perspective-1000 max-w-md w-full mx-auto"
      style={{ height }}
      onClick={handleFlip}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div 
          ref={frontRef}
          className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border-2 border-blue-100"
        >
          <div className="flex-1 flex items-center justify-center">
            <h3 className="text-xl font-bold text-center text-gray-800">{front}</h3>
          </div>
          <div className="text-center mt-4 text-sm text-gray-500">Click to flip</div>
        </div>
        
        {/* Back */}
        <div 
          ref={backRef}
          className="absolute w-full h-full backface-hidden bg-indigo-50 rounded-xl shadow-lg p-6 rotate-y-180 border-2 border-indigo-200"
        >
          <div className="flex-1">
            <div className="text-gray-700 text-lg">{back}</div>
          </div>
          <div className="text-center mt-4 text-sm text-gray-500">Click to flip back</div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
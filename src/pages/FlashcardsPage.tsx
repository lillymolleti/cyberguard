import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Flashcard from '../components/flashcards/Flashcard';
import { ChevronLeft, ChevronRight, BookOpen, Check } from 'lucide-react';

// Mock data for cybersecurity flashcards
const CYBERSECURITY_FLASHCARDS = [
  {
    id: '1',
    category: 'Basics',
    front: 'What is Two-Factor Authentication (2FA)?',
    back: 'Two-Factor Authentication is a security process that requires users to provide two different authentication factors to verify their identity. This typically includes something you know (password) and something you have (mobile device or security key).',
  },
  {
    id: '2',
    category: 'Threats',
    front: 'What is Phishing?',
    back: 'Phishing is a cybercrime where attackers disguise themselves as trustworthy entities in emails, messages, or websites to trick individuals into revealing sensitive information such as passwords, credit card numbers, or personal data.',
  },
  {
    id: '3',
    category: 'Security',
    front: 'What is a Password Hash?',
    back: 'A password hash is a one-way transformation of a password into a fixed-length string of characters. Proper hashing ensures that even if a database is compromised, the actual passwords remain protected as hashes cannot be reversed back to the original password.',
  },
  {
    id: '4',
    category: 'Networks',
    front: 'What is a Firewall?',
    back: 'A firewall is a network security device or software that monitors and filters incoming and outgoing network traffic based on predetermined security rules. It acts as a barrier between a trusted network and untrusted networks.',
  },
  {
    id: '5',
    category: 'Privacy',
    front: 'What is Data Encryption?',
    back: 'Data encryption is the process of converting data from a readable format (plaintext) into an encoded format (ciphertext) that can only be read or processed after it has been decrypted with the correct key.',
  },
  {
    id: '6',
    category: 'Threats',
    front: 'What is Ransomware?',
    back: 'Ransomware is a type of malicious software that encrypts a victim\'s files or locks their computer system. The attacker then demands a ransom payment to restore access to the data or system.',
  },
  {
    id: '7',
    category: 'Privacy',
    front: 'What is a VPN?',
    back: 'A Virtual Private Network (VPN) creates a secure, encrypted connection over a less secure network. It allows users to send and receive data across public networks as if their devices were directly connected to a private network, protecting privacy and sensitive information.',
  },
  {
    id: '8',
    category: 'Security',
    front: 'What is a Strong Password?',
    back: 'A strong password typically: 1) Is at least 12 characters long 2) Contains uppercase and lowercase letters 3) Contains numbers and special characters 4) Avoids dictionary words, personal information, or predictable sequences 5) Is unique for each account',
  },
];

interface FlashcardType {
  id: string;
  category: string;
  front: string;
  back: string;
}

const FlashcardsPage = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [completedCards, setCompletedCards] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    // In a real app, fetch flashcards from an API
    setFlashcards(CYBERSECURITY_FLASHCARDS);
    
    // Extract unique categories
    const uniqueCategories = ['All', ...new Set(CYBERSECURITY_FLASHCARDS.map(card => card.category))];
    setCategories(uniqueCategories);
  }, []);
  
  // Filter cards based on selected category
  const filteredCards = selectedCategory === 'All'
    ? flashcards
    : flashcards.filter(card => card.category === selectedCategory);
  
  const currentCard = filteredCards[currentCardIndex];
  
  const goToNextCard = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Circle back to the first card
      setCurrentCardIndex(0);
    }
  };
  
  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    } else {
      // Circle to the last card
      setCurrentCardIndex(filteredCards.length - 1);
    }
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentCardIndex(0); // Reset to first card when changing categories
  };
  
  const toggleCardCompletion = (id: string) => {
    const newCompletedCards = new Set(completedCards);
    if (newCompletedCards.has(id)) {
      newCompletedCards.delete(id);
    } else {
      newCompletedCards.add(id);
    }
    setCompletedCards(newCompletedCards);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      goToNextCard();
    } else if (e.key === 'ArrowLeft') {
      goToPrevCard();
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50" onKeyDown={handleKeyDown} tabIndex={0}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BookOpen className="mr-2 text-blue-600" size={28} />
            Cybersecurity Flashcards
          </h1>
          <p className="text-gray-600">
            Review key cybersecurity concepts with these interactive flashcards.
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Card {currentCardIndex + 1} of {filteredCards.length}
          </div>
          <div className="text-sm text-gray-600">
            {completedCards.size} of {flashcards.length} completed
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-300"
            style={{ width: `${(completedCards.size / flashcards.length) * 100}%` }}
          ></div>
        </div>
        
        {/* Flashcard */}
        <div className="mb-6 relative">
          {currentCard && (
            <>
              <Flashcard
                id={currentCard.id}
                front={currentCard.front}
                back={currentCard.back}
              />
              
              {/* Mark as reviewed button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => toggleCardCompletion(currentCard.id)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    completedCards.has(currentCard.id)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {completedCards.has(currentCard.id) ? (
                    <>
                      <Check size={16} className="mr-2" />
                      Marked as reviewed
                    </>
                  ) : (
                    'Mark as reviewed'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={goToPrevCard}
            className="flex items-center px-4 py-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" />
            Previous
          </button>
          
          <button
            onClick={goToNextCard}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            Next
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
        
        {/* Flashcard list (small screen) */}
        <div className="mt-8 md:hidden">
          <h2 className="text-lg font-medium text-gray-900 mb-3">All Flashcards</h2>
          <div className="space-y-2">
            {filteredCards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => setCurrentCardIndex(index)}
                className={`w-full text-left p-3 rounded-md ${
                  index === currentCardIndex
                    ? 'bg-blue-100 border border-blue-300'
                    : 'bg-white border border-gray-200'
                } ${
                  completedCards.has(card.id) ? 'border-l-4 border-l-green-500' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {card.front.length > 60 ? card.front.substring(0, 60) + '...' : card.front}
                  </span>
                  {completedCards.has(card.id) && <Check size={16} className="text-green-500" />}
                </div>
                <span className="text-xs text-gray-500 mt-1 block">{card.category}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FlashcardsPage;
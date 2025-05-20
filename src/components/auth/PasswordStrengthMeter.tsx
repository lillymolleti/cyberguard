import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

// Define password criteria
const hasSufficientLength = (password: string) => password.length >= 12;
const hasUppercase = (password: string) => /[A-Z]/.test(password);
const hasLowercase = (password: string) => /[a-z]/.test(password);
const hasNumber = (password: string) => /[0-9]/.test(password);
const hasSpecialChar = (password: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const [strength, setStrength] = useState({
    score: 0,
    label: '',
    color: '',
  });

  // Define criteria for UI
  const criteria = [
    { label: 'At least 12 characters', check: hasSufficientLength },
    { label: 'Contains uppercase letter', check: hasUppercase },
    { label: 'Contains lowercase letter', check: hasLowercase },
    { label: 'Contains number', check: hasNumber },
    { label: 'Contains special character', check: hasSpecialChar },
  ];

  useEffect(() => {
    let score = 0;
    
    if (hasSufficientLength(password)) score++;
    if (hasUppercase(password)) score++;
    if (hasLowercase(password)) score++;
    if (hasNumber(password)) score++;
    if (hasSpecialChar(password)) score++;
    
    const strengthLabels = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-600'];
    
    // Adjust index based on password length to prevent "Strong" rating for short passwords
    let index = score - 1;
    if (password.length < 8) {
      index = Math.min(index, 1); // Cap at "Weak" for short passwords
    }
    
    if (password === '') {
      setStrength({ score: 0, label: '', color: '' });
    } else {
      setStrength({
        score,
        label: strengthLabels[index] || 'Very Weak',
        color: strengthColors[index] || 'bg-red-500',
      });
    }
  }, [password]);

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 mb-4">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${strength.color} transition-all duration-300 ease-in-out`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        ></div>
      </div>
      
      {/* Strength label */}
      <p className={`text-sm mt-1 font-medium ${
        strength.color === 'bg-red-500' ? 'text-red-600' :
        strength.color === 'bg-orange-500' ? 'text-orange-600' :
        strength.color === 'bg-yellow-500' ? 'text-yellow-600' :
        'text-green-600'
      }`}>
        {strength.label}
      </p>
      
      {/* Password requirements */}
      <div className="mt-3 space-y-1">
        {criteria.map((criterion, index) => (
          <div key={index} className="flex items-center text-sm">
            {criterion.check(password) ? (
              <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
            ) : (
              <X size={16} className="text-red-500 mr-2 flex-shrink-0" />
            )}
            <span className={criterion.check(password) ? 'text-gray-700' : 'text-gray-500'}>
              {criterion.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
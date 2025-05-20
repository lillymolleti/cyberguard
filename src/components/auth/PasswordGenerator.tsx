import { useState } from 'react';
import { RefreshCcw, Eye, EyeOff, Copy, Check } from 'lucide-react';

interface PasswordGeneratorProps {
  onSelect: (password: string) => void;
}

const PasswordGenerator = ({ onSelect }: PasswordGeneratorProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const generatePassword = () => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';
    
    let chars = '';
    if (options.uppercase) chars += uppercaseChars;
    if (options.lowercase) chars += lowercaseChars;
    if (options.numbers) chars += numberChars;
    if (options.symbols) chars += symbolChars;
    
    // Fallback if nothing selected
    if (!chars) chars = lowercaseChars + numberChars;
    
    let generatedPassword = '';
    for (let i = 0; i < options.length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      generatedPassword += chars[randomIndex];
    }
    
    // Ensure all selected character types are included
    let missingTypes = [];
    if (options.uppercase && !/[A-Z]/.test(generatedPassword)) missingTypes.push(uppercaseChars);
    if (options.lowercase && !/[a-z]/.test(generatedPassword)) missingTypes.push(lowercaseChars);
    if (options.numbers && !/[0-9]/.test(generatedPassword)) missingTypes.push(numberChars);
    if (options.symbols && !/[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(generatedPassword)) missingTypes.push(symbolChars);
    
    // Replace random characters with missing types
    for (const charType of missingTypes) {
      const randomPos = Math.floor(Math.random() * options.length);
      const randomChar = charType[Math.floor(Math.random() * charType.length)];
      generatedPassword = generatedPassword.substring(0, randomPos) + randomChar + generatedPassword.substring(randomPos + 1);
    }
    
    setPassword(generatedPassword);
    return generatedPassword;
  };

  const handleGenerateClick = () => {
    const newPassword = generatePassword();
    setCopied(false);
    // Optional: automatically select the password
    onSelect(newPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleUsePassword = () => {
    onSelect(password);
  };

  const updateOption = (option: keyof typeof options, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [option]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Generate Strong Password</h3>
      
      <div className="mb-4 relative">
        <div className="flex">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            readOnly
            className="w-full p-2 pr-20 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Generated password"
          />
          <button
            onClick={handleGenerateClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-r-md transition-colors"
            aria-label="Generate password"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
        
        <div className="absolute right-12 top-1/2 -translate-y-1/2 flex space-x-1">
          <button 
            onClick={toggleShowPassword} 
            className="text-gray-500 hover:text-gray-700 p-1 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button 
            onClick={copyToClipboard} 
            className="text-gray-500 hover:text-gray-700 p-1 transition-colors"
            aria-label="Copy to clipboard"
            disabled={!password}
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
        </div>
      </div>
      
      {/* Options */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Length: {options.length}</label>
        <input 
          type="range" 
          min="8" 
          max="32" 
          value={options.length} 
          onChange={(e) => updateOption('length', parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <label className="flex items-center text-sm text-gray-700">
          <input 
            type="checkbox" 
            checked={options.uppercase} 
            onChange={(e) => updateOption('uppercase', e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          Uppercase (A-Z)
        </label>
        <label className="flex items-center text-sm text-gray-700">
          <input 
            type="checkbox" 
            checked={options.lowercase} 
            onChange={(e) => updateOption('lowercase', e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          Lowercase (a-z)
        </label>
        <label className="flex items-center text-sm text-gray-700">
          <input 
            type="checkbox" 
            checked={options.numbers} 
            onChange={(e) => updateOption('numbers', e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          Numbers (0-9)
        </label>
        <label className="flex items-center text-sm text-gray-700">
          <input 
            type="checkbox" 
            checked={options.symbols} 
            onChange={(e) => updateOption('symbols', e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          Symbols (!@#$...)
        </label>
      </div>
      
      <button
        onClick={handleUsePassword}
        disabled={!password}
        className={`w-full py-2 px-4 rounded-md transition-colors ${
          password 
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Use This Password
      </button>
    </div>
  );
};

export default PasswordGenerator;
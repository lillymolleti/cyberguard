import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));

// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per IP
  message: { message: 'Too many login attempts, please try again later' }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cybersecurity-app')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Progress model
const progressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  quizzesCompleted: { type: Number, default: 0 },
  quizScores: [{ 
    quizId: String,
    score: Number,
    completedAt: { type: Date, default: Date.now }
  }],
  flashcardsReviewed: { type: Number, default: 0 },
  reviewedFlashcards: [{ 
    cardId: String,
    lastReviewed: { type: Date, default: Date.now }
  }],
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
});

const Progress = mongoose.model('Progress', progressSchema);

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Create initial progress record
    const progress = new Progress({
      userId: user._id
    });

    await progress.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Set cookie with token
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update user's last active time
    await Progress.findOneAndUpdate(
      { userId: user._id },
      { lastActive: Date.now() }
    );

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Set cookie with token
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production'
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Password strength checker endpoint
app.post('/api/password/check', (req, res) => {
  const { password } = req.body;
  
  // Simple password strength scoring
  let score = 0;
  
  // Length check
  if (password.length >= 12) score += 1;
  
  // Character type checks
  if (/[A-Z]/.test(password)) score += 1; // Uppercase
  if (/[a-z]/.test(password)) score += 1; // Lowercase
  if (/[0-9]/.test(password)) score += 1; // Numbers
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special chars
  
  let strength = '';
  if (score <= 2) strength = 'Weak';
  else if (score <= 3) strength = 'Moderate';
  else strength = 'Strong';
  
  res.json({ score, strength });
});

// Password generator endpoint
app.get('/api/password/generate', (req, res) => {
  const length = parseInt(req.query.length) || 16;
  const includeUppercase = req.query.uppercase !== 'false';
  const includeLowercase = req.query.lowercase !== 'false';
  const includeNumbers = req.query.numbers !== 'false';
  const includeSymbols = req.query.symbols !== 'false';
  
  let chars = '';
  if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (includeNumbers) chars += '0123456789';
  if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // Ensure at least some character set is included
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  
  res.json({ password });
});

// Get user progress
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user.id });
    
    if (!progress) {
      // Create new progress record if not found
      progress = new Progress({ userId: req.user.id });
      await progress.save();
    }
    
    res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update quiz progress
app.post('/api/progress/quiz', authenticateToken, async (req, res) => {
  try {
    const { quizId, score } = req.body;
    
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id },
      { 
        $inc: { quizzesCompleted: 1 },
        $push: { quizScores: { quizId, score, completedAt: Date.now() } },
        lastActive: Date.now()
      },
      { new: true, upsert: true }
    );
    
    res.json({ progress });
  } catch (error) {
    console.error('Update quiz progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update flashcard progress
app.post('/api/progress/flashcard', authenticateToken, async (req, res) => {
  try {
    const { cardId } = req.body;
    
    // Check if card already exists in the reviewed list
    const existingProgress = await Progress.findOne({
      userId: req.user.id,
      'reviewedFlashcards.cardId': cardId
    });
    
    let progress;
    
    if (existingProgress) {
      // Update existing card's timestamp
      progress = await Progress.findOneAndUpdate(
        { 
          userId: req.user.id,
          'reviewedFlashcards.cardId': cardId
        },
        { 
          $set: { 'reviewedFlashcards.$.lastReviewed': Date.now() },
          lastActive: Date.now()
        },
        { new: true }
      );
    } else {
      // Add new card to reviewed list
      progress = await Progress.findOneAndUpdate(
        { userId: req.user.id },
        { 
          $inc: { flashcardsReviewed: 1 },
          $push: { reviewedFlashcards: { cardId, lastReviewed: Date.now() } },
          lastActive: Date.now()
        },
        { new: true, upsert: true }
      );
    }
    
    res.json({ progress });
  } catch (error) {
    console.error('Update flashcard progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
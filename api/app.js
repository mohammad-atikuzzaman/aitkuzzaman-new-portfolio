import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import projectRoutes from './routes/projects.js';
import thoughtRoutes from './routes/thoughts.js';
import testimonialRoutes from './routes/testimonials.js';
import uploadRoutes from './routes/upload.js';

// 1. Security Headers (Helmet)
import { 
  securityHeaders, 
  ipBanCheckMiddleware, 
  globalLimiter, 
  sanitizeNoSQL, 
  sanitizeXSS 
} from './middleware/security.js';

const app = express();

// Set trust proxy for accurate IP detection behind Vercel / Nginx reverse proxies
app.set('trust proxy', 1);

// Apply Security Headers
app.use(securityHeaders);

// Check if incoming client IP is banned
app.use(ipBanCheckMiddleware);

// Global Rate Limiting (DDoS / Scraping Protection)
app.use('/api', globalLimiter);

// CORS Policy
// CORS — restricted to known origins only
const allowedOrigins = [
  process.env.CORS_ORIGIN,           // e.g. 'https://your-portfolio.vercel.app'
  'http://localhost:5173',            // Vite dev server
  'http://localhost:5174',            // Vite dev server (fallback port)
  'http://localhost:5000',            // Express dev server
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ [CORS] Blocked request from unauthorized origin: ${origin}`);
      callback(new Error('CORS: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parsers with reasonable size limits (Prevents Large Payload DoS)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Sanitize inputs against NoSQL Operator Injection and XSS
app.use(sanitizeNoSQL);
app.use(sanitizeXSS);

// Middleware to ensure DB connection is ready (serverless friendly)
app.use(async (req, res, next) => {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
    }
    next();
  } catch (err) {
    console.error('Database connection middleware error:', err);
    next();
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/thoughts', thoughtRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'portfolio-backend-api',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);

  // CORS rejection from our origin whitelist
  if (err.message === 'CORS: Origin not allowed') {
    return res.status(403).json({ success: false, error: 'Origin not allowed' });
  }

  // Never leak internal error messages in production
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    success: false,
    error: isProduction ? 'Internal Server Error' : (err.message || 'Internal Server Error'),
  });
});

export default app;

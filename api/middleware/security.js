import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// =========================================================================
// 1. IN-MEMORY IP BAN & ABUSE TRACKING SYSTEM
// =========================================================================
const bannedIPs = new Map(); // ip -> { bannedUntil: timestamp, reason: string, strikes: number }
const abuseTracker = new Map(); // ip -> { failedLogins: number, lastAttempt: timestamp }

const BAN_DURATION_MS = 60 * 60 * 1000; // 1 hour ban
const MAX_FAILED_LOGINS = 5; // 5 failed logins = auto IP ban

export function getClientIP(req) {
  // Respect Vercel / Cloudflare / reverse proxy headers
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || 'unknown';
}

export function recordFailedLogin(ip, reason = 'Repeated failed login attempts') {
  const current = abuseTracker.get(ip) || { failedLogins: 0, lastAttempt: Date.now() };
  current.failedLogins += 1;
  current.lastAttempt = Date.now();
  abuseTracker.set(ip, current);

  if (current.failedLogins >= MAX_FAILED_LOGINS) {
    banIP(ip, reason);
  }
}

export function resetLoginAttempts(ip) {
  abuseTracker.delete(ip);
}

export function banIP(ip, reason = 'Malicious activity detected') {
  const bannedUntil = Date.now() + BAN_DURATION_MS;
  bannedIPs.set(ip, { bannedUntil, reason, timestamp: Date.now() });
  console.warn(`🚨 [SECURITY ACTION] IP ${ip} has been BANNED until ${new Date(bannedUntil).toISOString()} | Reason: ${reason}`);
}

export function unbanIP(ip) {
  return bannedIPs.delete(ip);
}

export function getBannedIPsList() {
  const now = Date.now();
  // Clean up expired bans
  for (const [ip, data] of bannedIPs.entries()) {
    if (now > data.bannedUntil) {
      bannedIPs.delete(ip);
    }
  }
  return Array.from(bannedIPs.entries()).map(([ip, data]) => ({
    ip,
    bannedUntil: data.bannedUntil,
    reason: data.reason,
    expiresInMinutes: Math.max(0, Math.round((data.bannedUntil - now) / 60000)),
  }));
}

// Middleware: Check if IP is banned
export function ipBanCheckMiddleware(req, res, next) {
  const ip = getClientIP(req);
  const banInfo = bannedIPs.get(ip);

  if (banInfo) {
    if (Date.now() < banInfo.bannedUntil) {
      const remainingMinutes = Math.ceil((banInfo.bannedUntil - Date.now()) / 60000);
      return res.status(403).json({
        success: false,
        error: `Access Denied: Your IP (${ip}) is temporarily banned due to suspicious activity. Try again in ${remainingMinutes} minute(s).`,
      });
    } else {
      // Ban has expired
      bannedIPs.delete(ip);
      abuseTracker.delete(ip);
    }
  }

  next();
}

// =========================================================================
// 2. NoSQL INJECTION & OPERATOR SANITIZATION MIDDLEWARE
// =========================================================================
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  for (const key of Object.keys(obj)) {
    // Detect MongoDB query operators like $gt, $ne, $where, or dot notation attacks
    if (key.startsWith('$') || key.includes('.')) {
      console.warn(`⚠️ [SECURITY] Detected and removed illegal NoSQL key: ${key}`);
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
  return obj;
}

export function sanitizeNoSQL(req, res, next) {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
}

// =========================================================================
// 3. XSS & PAYLOAD HYGIENE MIDDLEWARE
// =========================================================================
export function sanitizeXSS(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        // Remove dangerous script tags and null bytes
        req.body[key] = value
          .replace(/\0/g, '')
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .trim();
      }
    }
  }
  next();
}

// =========================================================================
// 4. RATE LIMITERS (DDoS & Brute-Force Protection)
// =========================================================================

// Global API Limiter: 150 requests per 15 minutes
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIP(req),
  handler: (req, res) => {
    const ip = getClientIP(req);
    console.warn(`⚠️ [RATE LIMIT] Global limit exceeded by IP: ${ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP address. Please slow down and try again after 15 minutes.',
    });
  },
});

// Auth / Login Rate Limiter: Strictly 5 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIP(req),
  handler: (req, res) => {
    const ip = getClientIP(req);
    recordFailedLogin(ip, 'Exceeded maximum login rate limit (Brute Force)');
    res.status(429).json({
      success: false,
      error: 'Too many login attempts. Your IP has been temporarily flagged for security. Please try again in 15 minutes.',
    });
  },
});

// Contact Form Limiter: 5 submissions per 15 minutes per IP (Anti-Spam / Anti-Mail-Bombing)
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIP(req),
  handler: (req, res) => {
    const ip = getClientIP(req);
    console.warn(`⚠️ [SPAM ALERT] Contact form rate limit hit by IP: ${ip}`);
    res.status(429).json({
      success: false,
      error: 'You have submitted too many messages in a short period. Please wait 15 minutes before sending another inquiry.',
    });
  },
});

// =========================================================================
// 5. HELMET SECURITY HEADERS CONFIGURATION
// =========================================================================
export const securityHeaders = helmet({
  contentSecurityPolicy: false, // Disabled to allow external media (Three.js canvas, Framer assets, Unsplash, Google Fonts)
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: { allow: true },
  frameguard: { action: 'deny' }, // Anti-Clickjacking: prevents embedding in iframes
  hidePoweredBy: true, // Hides X-Powered-By: Express
  hsts: {
    maxAge: 31536000, // 1 year HSTS
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true, // Prevents MIME-type sniffing
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true, // Enables browser XSS filters
});

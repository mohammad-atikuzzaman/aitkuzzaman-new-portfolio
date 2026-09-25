import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { verifyAdmin } from '../middleware/auth.js';
import { 
  authLimiter, 
  getClientIP, 
  recordFailedLogin, 
  resetLoginAttempts,
  getBannedIPsList,
  unbanIP
} from '../middleware/security.js';

const router = express.Router();

// Lazy JWT secret accessor — validates env var is set when first used (after dotenv loads)
let _jwtSecret = null;
function getJWTSecret() {
  if (!_jwtSecret) {
    if (!process.env.JWT_SECRET) {
      throw new Error('FATAL: JWT_SECRET environment variable is required. Set it in .env or Vercel environment settings.');
    }
    _jwtSecret = process.env.JWT_SECRET;
  }
  return _jwtSecret;
}

// Check if initial admin setup is required
router.get('/setup-status', async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    res.json({ success: true, needsSetup: adminCount === 0 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Initial Admin Setup (creates first admin if none exists)
router.post('/setup', authLimiter, async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(400).json({ success: false, error: 'Admin already initialized. Please login.' });
    }

    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters long for security' });
    }

    const admin = new Admin({
      email,
      password,
      name: name || 'Portfolio Admin',
    });
    await admin.save();

    const clientIP = getClientIP(req);
    resetLoginAttempts(clientIP);

    const token = jwt.sign({ id: admin._id, email: admin.email }, getJWTSecret(), { expiresIn: '7d' });
    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      token,
      admin: { id: admin._id, email: admin.email, name: admin.name },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Login with Strict Brute-Force & IP Ban Protection
router.post('/login', authLimiter, async (req, res) => {
  const clientIP = getClientIP(req);

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      recordFailedLogin(clientIP, 'Failed login: unknown email');
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      recordFailedLogin(clientIP, `Failed password attempt for ${email}`);
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Login successful: clear failure counts for this IP
    resetLoginAttempts(clientIP);

    const token = jwt.sign({ id: admin._id, email: admin.email }, getJWTSecret(), { expiresIn: '7d' });
    res.json({
      success: true,
      token,
      admin: { id: admin._id, email: admin.email, name: admin.name },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Verify current session
router.get('/me', verifyAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    res.json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Change Password
router.put('/change-password', verifyAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Both current and new password are required' });
    }

    const admin = await Admin.findById(req.admin.id);
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Current password does not match' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: View Banned IPs
router.get('/banned-ips', verifyAdmin, (req, res) => {
  res.json({ success: true, bannedIPs: getBannedIPsList() });
});

// Admin: Unban IP
router.post('/unban-ip', verifyAdmin, (req, res) => {
  const { ip } = req.body;
  if (!ip) return res.status(400).json({ success: false, error: 'IP is required' });
  const result = unbanIP(ip);
  res.json({ success: true, message: `IP ${ip} unbanned`, unbanned: result });
});

export default router;

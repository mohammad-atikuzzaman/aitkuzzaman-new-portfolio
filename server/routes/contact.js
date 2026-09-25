import express from 'express';
import validator from 'validator';
import Message from '../models/Message.js';
import { sendNotificationEmail, sendThankYouEmail } from '../config/nodemailer.js';
import { verifyAdmin } from '../middleware/auth.js';
import { contactLimiter } from '../middleware/security.js';

const router = express.Router();

// Public: Submit Contact Form with Anti-Spam Rate Limit & Honeypot
router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, project, message, hp_website_trap } = req.body;

    // 1. Honeypot check: Bots auto-fill hidden input fields, humans don't
    if (hp_website_trap) {
      console.warn('🤖 [BOT DETECTED] Honeypot triggered in contact form.');
      // Return fake 200 OK so bot thinks it succeeded, without saving or sending mail
      return res.status(200).json({ success: true, message: 'Thank you! Your message has been received.' });
    }

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required.' });
    }

    // 2. Strict Input Validation & Length Bounds (Anti-Buffer-Overflow / DoS)
    if (typeof name !== 'string' || name.length > 100) {
      return res.status(400).json({ success: false, error: 'Name is too long (max 100 characters).' });
    }

    if (!validator.isEmail(email) || email.length > 100) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    if (project && (typeof project !== 'string' || project.length > 1000)) {
      return res.status(400).json({ success: false, error: 'Project description is too long (max 1,000 characters).' });
    }

    if (message && (typeof message !== 'string' || message.length > 5000)) {
      return res.status(400).json({ success: false, error: 'Message is too long (max 5,000 characters).' });
    }

    // 3. Save to Database (sanitized)
    const newMessage = new Message({
      name: validator.escape(name.trim()),
      email: email.trim().toLowerCase(),
      project: project?.trim() || '',
      message: message?.trim() || '',
      status: 'unread',
    });
    await newMessage.save();

    // 2. Trigger Email Notifications asynchronously (admin notification + sender thank you)
    try {
      await Promise.allSettled([
        sendNotificationEmail({
          name: newMessage.name,
          email: newMessage.email,
          project: newMessage.project,
          message: newMessage.message,
        }),
        sendThankYouEmail({
          name: newMessage.name,
          email: newMessage.email,
          project: newMessage.project,
        }),
      ]);
    } catch (mailErr) {
      console.warn('⚠️ Email delivery notice:', mailErr.message);
      // We do not fail the request if mail fails, since data is already safely stored in DB
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      data: newMessage,
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ success: false, error: 'Failed to process your request' });
  }
});

// Admin: Get all contact messages
router.get('/messages', verifyAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    const unreadCount = await Message.countDocuments({ status: 'unread' });

    res.json({
      success: true,
      unreadCount,
      messages,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Update message status (e.g. read, replied)
router.patch('/messages/:id', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    res.json({ success: true, message: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Delete a message
router.delete('/messages/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

import express from 'express';
import Thought from '../models/Thought.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

const initialThoughts = [
  {
    title: 'Building Trust Through Clear Design',
    date: 'May 5, 2025',
    readTime: '6 min read',
    description: 'How thoughtful visual choices create a stronger sense of reliability for modern brands.',
    image: 'https://framerusercontent.com/images/kAftuUN9iRKwIt9M6RqZo9NS314.jpg?scale-down-to=1024&width=3840&height=5275',
    content: `Design is rarely just about decoration—it is about establishing a direct bridge of confidence between a brand and its audience. When visitors land on a page, they make subconscious judgments within milliseconds.

Clarity stems from deliberate constraints: disciplined typographic scales, purposeful hierarchy, ample breathing room, and predictable interaction models.

When users do not have to struggle to decipher where to look, what to do, or what a product accomplishes, friction dissolves. Trust is the compounding dividend of continuous cognitive ease.`,
    published: true,
    order: 1,
  },
  {
    title: 'The Role of Art Direction in Branding',
    date: 'Jun 16, 2025',
    readTime: '5 min read',
    description: 'Why visual direction helps brands create emotion and a distinct point of view.',
    image: 'https://framerusercontent.com/images/Y9KmJAQ4w53hsc4jJojfokLZ7D8.jpg?scale-down-to=1024&width=2662&height=3993',
    content: `In an era where digital products look increasingly standardized through identical UI kits, art direction is what rescues a brand from the sea of sameness.

Art direction governs tone, texture, photography mood, and movement. It is the intangible layer that translates business ambition into felt human emotion.

By aligning aesthetic choices with a company's authentic mission, you create an indelible signature that competitors cannot easily copy.`,
    published: true,
    order: 2,
  },
];

// Public: Get all published thoughts
router.get('/', async (req, res) => {
  try {
    let thoughts = await Thought.find({ published: true }).sort({ order: 1, createdAt: -1 });

    if (thoughts.length === 0) {
      try {
        await Thought.insertMany(initialThoughts);
        thoughts = await Thought.find({ published: true }).sort({ order: 1, createdAt: -1 });
      } catch (seedErr) {
        console.warn('Initial thought seed note:', seedErr.message);
      }
    }

    res.json({ success: true, thoughts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, fallback: initialThoughts });
  }
});

// Admin: Get all thoughts (including unpublished drafts)
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, thoughts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Create Thought
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, date, readTime, description, image, content, published, order } = req.body;
    if (!title || !image) {
      return res.status(400).json({ success: false, error: 'Title and image are required' });
    }

    const thought = new Thought({
      title,
      date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: readTime || '5 min read',
      description,
      image,
      content,
      published: published !== undefined ? published : true,
      order: order !== undefined ? Number(order) : 0,
    });
    await thought.save();

    res.status(201).json({ success: true, thought });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Update Thought
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const updated = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Thought not found' });
    }
    res.json({ success: true, thought: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Delete Thought
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Thought.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Thought not found' });
    }
    res.json({ success: true, message: 'Thought deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

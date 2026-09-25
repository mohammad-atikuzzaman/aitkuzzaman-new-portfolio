import express from 'express';
import Testimonial from '../models/Testimonial.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

const initialTestimonials = [
  {
    quote: "Templyo completely changed how I approach building sites in Framer. The templates are not just beautiful, they’re actually structured in a way that makes scaling so much easier.",
    name: "Yakoub Kashmiri",
    role: "Marketing Director",
    company: "Agency",
    avatar: "https://framerusercontent.com/images/WsYTUG4cqmLIU4lwbMUQX7FdOY.png?width=160&height=160",
    order: 1,
  },
  {
    quote: "I’ve tried dozens of Framer templates, but Templyo stands out. Everything feels intentional, from the layout to the smallest interactions.",
    name: "Daniel K.",
    role: "Indie Maker",
    company: "Tech",
    avatar: "https://framerusercontent.com/images/HqoHkPp6dpJFdgMqUKIaAXmy7o.jpg?scale-down-to=512&width=3220&height=3220",
    order: 2,
  },
  {
    quote: "Templyo saved me weeks of work. I was able to launch my landing page in a day, and it still looks fully custom.",
    name: "Mark M.",
    role: "Startup Founder",
    company: "Studio",
    avatar: "https://framerusercontent.com/images/HH8KrojyxZx6X20z1r13CSwiiWE.jpg?scale-down-to=512&width=3648&height=3648",
    order: 3,
  },
  {
    quote: "The quality is insane. Clean structure, smooth animations, and super easy to customize. It feels like a premium product from start to finish.",
    name: "Omar H.",
    role: "Frontend Developer",
    company: "Creative",
    avatar: "https://framerusercontent.com/images/MG7SSqT3AUbDDMeyGynYFWvAWI.png?width=160&height=160",
    order: 4,
  },
];

// Public: Get all testimonials
router.get('/', async (req, res) => {
  try {
    let testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });

    if (testimonials.length === 0) {
      try {
        await Testimonial.insertMany(initialTestimonials);
        testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
      } catch (seedErr) {
        console.warn('Initial testimonial seed note:', seedErr.message);
      }
    }

    res.json({ success: true, testimonials });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, fallback: initialTestimonials });
  }
});

// Admin: Create Testimonial
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { quote, name, role, company, avatar, rating, order } = req.body;
    if (!quote || !name) {
      return res.status(400).json({ success: false, error: 'Quote and name are required' });
    }

    const testimonial = new Testimonial({
      quote,
      name,
      role,
      company,
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop',
      rating: rating || 5,
      order: order !== undefined ? Number(order) : 0,
    });
    await testimonial.save();

    res.status(201).json({ success: true, testimonial });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Update Testimonial
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }
    res.json({ success: true, testimonial: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Delete Testimonial
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

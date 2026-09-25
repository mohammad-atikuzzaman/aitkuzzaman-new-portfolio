import express from 'express';
import Project from '../models/Project.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

const initialProjects = [
  {
    title: 'Damas',
    category: 'Agency Framer Template',
    image: 'https://framerusercontent.com/images/VNXQLcPHw9VbVzy6BDpZ8pUsaU.png?scale-down-to=1024&width=1160&height=800',
    fullImage: 'https://framerusercontent.com/images/VNXQLcPHw9VbVzy6BDpZ8pUsaU.png?width=1160&height=800',
    color: '#0e0f12',
    year: '2025',
    link: 'https://damas.framer.website/',
    description: 'A modern, high-converting agency template built for creative studios and digital agencies seeking a distinct, authoritative brand presence. Features bespoke animations, CMS-driven case studies, and responsive design systems.',
    featured: true,
    order: 1,
  },
  {
    title: 'Najm',
    category: 'SaaS Framer Template',
    image: 'https://framerusercontent.com/images/WgEHVRrQs62rgxlzrnXJJ8rr4.png?scale-down-to=1024&width=1160&height=800',
    fullImage: 'https://framerusercontent.com/images/WgEHVRrQs62rgxlzrnXJJ8rr4.png?width=1160&height=800',
    color: '#1a102f',
    year: '2025',
    link: 'https://najm.framer.website/',
    description: 'Engineered specifically for SaaS startups to showcase product features, metrics, interactive bento grids, and tiered pricing with unmatched clarity and fluid interaction.',
    featured: true,
    order: 2,
  },
  {
    title: 'Kavi',
    category: 'AI Framer Template',
    image: 'https://framerusercontent.com/images/I3azeVtkvdKBGl9TX38tUdXEb0.png?scale-down-to=1024&width=1160&height=800',
    fullImage: 'https://framerusercontent.com/images/I3azeVtkvdKBGl9TX38tUdXEb0.png?width=1160&height=800',
    color: '#24121a',
    year: '2025',
    link: 'https://kavi.framer.website/',
    description: 'Futuristic and clean AI web template crafted for generative AI applications and tech innovators. Built with sleek glassmorphism, prompt simulator widgets, and smooth micro-interactions.',
    featured: true,
    order: 3,
  },
  {
    title: 'Sham',
    category: 'Studio Framer Template',
    image: 'https://framerusercontent.com/images/e3DxUGJWqt7CIVVQIA0VZoy09FQ.png?scale-down-to=1024&width=1160&height=800',
    fullImage: 'https://framerusercontent.com/images/e3DxUGJWqt7CIVVQIA0VZoy09FQ.png?width=1160&height=800',
    color: '#121212',
    year: '2024',
    link: 'https://sham.framer.website/',
    description: 'Minimalist architecture and design studio showcase focusing on high-contrast typography, generous negative space, and refined editorial layouts.',
    featured: true,
    order: 4,
  },
];

// Public: Get all projects (auto-seeds if empty)
router.get('/', async (req, res) => {
  try {
    let projects = await Project.find().sort({ order: 1, createdAt: -1 });

    // Auto-seed if database is completely empty
    if (projects.length === 0) {
      try {
        await Project.insertMany(initialProjects);
        projects = await Project.find().sort({ order: 1, createdAt: -1 });
      } catch (seedErr) {
        console.warn('Initial project seed note:', seedErr.message);
      }
    }

    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, fallback: initialProjects });
  }
});

// Admin: Create Project
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, category, image, fullImage, color, year, link, github, description, featured, order } = req.body;
    if (!title || !image) {
      return res.status(400).json({ success: false, error: 'Title and image are required' });
    }

    const project = new Project({
      title,
      category,
      image,
      fullImage: fullImage || image,
      color: color || '#0e0f12',
      year: year || new Date().getFullYear().toString(),
      link,
      github,
      description,
      featured: featured !== undefined ? featured : true,
      order: order !== undefined ? Number(order) : 0,
    });
    await project.save();

    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Update Project
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, project: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Delete Project
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

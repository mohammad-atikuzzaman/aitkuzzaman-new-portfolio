import mongoose from 'mongoose';

const thoughtSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, sparse: true },
    title: { type: String, required: true },
    date: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
    readTime: { type: String, default: '5 min read' },
    description: { type: String, default: '' },
    image: { type: String, required: true },
    content: { type: String, default: '' },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Thought || mongoose.model('Thought', thoughtSchema);

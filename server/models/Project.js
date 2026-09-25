import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, sparse: true },
    title: { type: String, required: true },
    category: { type: String, default: 'Web Design / Development' },
    image: { type: String, required: true },
    fullImage: { type: String },
    color: { type: String, default: '#0e0f12' },
    year: { type: String, default: () => new Date().getFullYear().toString() },
    link: { type: String, default: '' },
    github: { type: String, default: '' },
    description: { type: String, default: '' },
    featured: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model('Project', projectSchema);

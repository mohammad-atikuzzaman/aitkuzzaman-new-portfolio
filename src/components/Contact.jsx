import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 1.64-1.64c0-.9-.74-1.64-1.64-1.64a1.64 1.64 0 0 0-1.64 1.64c0 .9.74 1.64 1.64 1.64m1.39 9.74v-8.37H5.07v8.37h2.78z" />
  </svg>
);

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', project: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not send message. Please try again.');
      }

      setSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error('Contact form error:', err);
      // If server is offline during development, gracefully allow fallback or display notice
      setError(err.message || 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Let's talk & Socials */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
          <div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#111111] mb-6 font-heading">
              Let’s talk.
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600 max-w-md leading-relaxed">
              Have a project or need help? Fill out the form, and we'll get back to you soon.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3 pt-4">
            {[
              { icon: <GithubIcon size={19} />, href: 'https://github.com/mohammad-atikuzzaman', label: 'GitHub' },
              { icon: <FacebookIcon size={18} />, href: 'https://www.facebook.com/mohammadakash20', label: 'Facebook' },
              { icon: <LinkedinIcon size={18} />, href: 'https://www.linkedin.com/in/matikuzzaman', label: 'LinkedIn' },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-neutral-800 hover:text-black hover:bg-neutral-100 hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-6">
          <div className="bg-[#141414] rounded-[32px] p-8 sm:p-12 text-white shadow-2xl border border-white/5">
            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-300">
                <CheckCircle2 size={56} className="text-emerald-400" />
                <h3 className="text-2xl font-bold font-heading">Message Sent!</h3>
                <p className="text-neutral-400 max-w-sm">
                  Thank you for reaching out, {formData.name}. We will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', project: '' });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field: invisible to humans, attracts automated spam bots */}
                <div className="hidden opacity-0 h-0 w-0 absolute pointer-events-none" aria-hidden="true">
                  <input
                    type="text"
                    name="hp_website_trap"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.hp_website_trap || ''}
                    onChange={(e) => setFormData({ ...formData, hp_website_trap: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Your Project
                  </label>
                  <textarea
                    rows={4}
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    placeholder="Tell us about your project"
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all resize-none"
                  />
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-white text-black font-bold text-base hover:bg-neutral-200 active:scale-[0.99] transition-all duration-200 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

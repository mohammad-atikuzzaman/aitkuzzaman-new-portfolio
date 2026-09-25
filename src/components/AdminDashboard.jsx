import React, { useState, useEffect } from 'react';
import { 
  Lock, Mail, FolderKanban, BookOpen, Quote, 
  Plus, Trash2, Edit3, CheckCircle2, AlertCircle, 
  LogOut, ArrowLeft, ExternalLink, RefreshCw, Upload,
  Eye, Check, Key
} from 'lucide-react';

export default function AdminDashboard({ onBackToSite }) {
  const [token, setToken] = useState(localStorage.getItem('portfolio_admin_token') || '');
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('messages'); // messages, projects, thoughts, testimonials, settings
  
  // Auth Form State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Data states
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [projects, setProjects] = useState([]);
  const [thoughts, setThoughts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Modal / Form state for Add/Edit
  const [modalType, setModalType] = useState(null); // 'project', 'thought', 'testimonial'
  const [editingItem, setEditingItem] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState(null);

  // Settings / Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState(null);

  const showNotice = (msg, isError = false) => {
    setNotification({ msg, isError });
    setTimeout(() => setNotification(null), 4000);
  };

  // Check setup status on initial load if no token
  useEffect(() => {
    if (!token) {
      fetch('/api/auth/setup-status')
        .then((r) => r.json())
        .then((data) => {
          if (data?.needsSetup) {
            setIsSetupMode(true);
          }
        })
        .catch(() => {});
    } else {
      verifyCurrentToken();
    }
  }, [token]);

  const verifyCurrentToken = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.admin) {
        setAdmin(data.admin);
        fetchAllData();
      } else {
        handleLogout();
      }
    } catch {
      handleLogout();
    }
  };

  const handleLoginOrSetup = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const endpoint = isSetupMode ? '/api/auth/setup' : '/api/auth/login';
    const body = isSetupMode 
      ? { email: authEmail, password: authPassword, name: authName }
      : { email: authEmail, password: authPassword };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('portfolio_admin_token', data.token);
      setToken(data.token);
      setAdmin(data.admin);
      setIsSetupMode(false);
      showNotice(isSetupMode ? 'Admin profile setup successfully!' : 'Logged in successfully!');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio_admin_token');
    setToken('');
    setAdmin(null);
  };

  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Messages
      const msgRes = await fetch('/api/contact/messages', { headers });
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData.messages || []);
        setUnreadCount(msgData.unreadCount || 0);
      }

      // Fetch Projects
      const projRes = await fetch('/api/projects');
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData.projects || []);
      }

      // Fetch Thoughts
      const thoughtRes = await fetch('/api/thoughts/all', { headers });
      if (thoughtRes.ok) {
        const thoughtData = await thoughtRes.json();
        setThoughts(thoughtData.thoughts || []);
      }

      // Fetch Testimonials
      const testRes = await fetch('/api/testimonials');
      if (testRes.ok) {
        const testData = await testRes.json();
        setTestimonials(testData.testimonials || []);
      }
    } catch (err) {
      console.error('Fetch data error:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Image Upload Handler to Cloudinary / Fallback
  const handleImageUpload = async (e, setFieldValue) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setFieldValue(data.url);
      showNotice('Image uploaded successfully!');
    } catch (err) {
      showNotice(err.message, true);
    } finally {
      setUploadingImage(false);
    }
  };

  // Message Actions
  const handleUpdateMessageStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/contact/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setMessages(messages.map((m) => (m._id === id ? { ...m, status } : m)));
        const newUnread = messages.filter((m) => (m._id === id ? status === 'unread' : m.status === 'unread')).length;
        setUnreadCount(newUnread);
        showNotice(`Message marked as ${status}`);
      }
    } catch {
      showNotice('Failed to update status', true);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      const res = await fetch(`/api/contact/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessages(messages.filter((m) => m._id !== id));
        showNotice('Message deleted');
      }
    } catch {
      showNotice('Failed to delete message', true);
    }
  };

  // Delete Entity
  const handleDeleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    const endpointMap = {
      project: `/api/projects/${id}`,
      thought: `/api/thoughts/${id}`,
      testimonial: `/api/testimonials/${id}`,
    };

    try {
      const res = await fetch(endpointMap[type], {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        if (type === 'project') setProjects(projects.filter((p) => p._id !== id));
        if (type === 'thought') setThoughts(thoughts.filter((t) => t._id !== id));
        if (type === 'testimonial') setTestimonials(testimonials.filter((t) => t._id !== id));
        showNotice(`${type} deleted successfully!`);
      }
    } catch {
      showNotice(`Failed to delete ${type}`, true);
    }
  };

  // Password Update
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordNotice(null);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      setPasswordNotice({ msg: 'Password changed successfully!', isError: false });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordNotice({ msg: err.message, isError: true });
    }
  };

  // -------------------------------------------------------------
  // RENDER: LOGIN / INITIAL SETUP VIEW
  // -------------------------------------------------------------
  if (!token || !admin) {
    return (
      <div className="min-h-screen bg-[#ECEAE5] flex items-center justify-center p-6 relative">
        <button
          onClick={onBackToSite}
          className="absolute top-8 left-8 inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Portfolio</span>
        </button>

        <div className="w-full max-w-md bg-[#141414] text-white rounded-[32px] p-8 sm:p-10 shadow-2xl border border-white/10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-4">
              <Lock size={26} />
            </div>
            <h1 className="text-2xl font-bold font-heading">
              {isSetupMode ? 'Create Admin Account' : 'Admin Control Panel'}
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              {isSetupMode 
                ? 'Welcome! Set up your primary admin credentials.'
                : 'Sign in to manage projects, thoughts and inquiries.'}
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginOrSetup} className="space-y-4">
            {isSetupMode && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-white/40"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-white/40"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-all shadow-md mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {authLoading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <span>{isSetupMode ? 'Complete Setup & Sign In' : 'Sign In'}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-neutral-500">
            {isSetupMode ? (
              <button 
                onClick={() => setIsSetupMode(false)}
                className="hover:text-white underline underline-offset-4"
              >
                Already have an admin account? Sign in
              </button>
            ) : (
              <button 
                onClick={() => setIsSetupMode(true)}
                className="hover:text-white underline underline-offset-4"
              >
                Need first-time setup? Click here
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: MAIN DASHBOARD VIEW
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#ECEAE5] text-[#111111]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-black transition-colors"
            >
              <ArrowLeft size={16} />
              <span>View Portfolio</span>
            </button>
            <div className="h-4 w-px bg-neutral-300" />
            <span className="font-heading font-bold text-base sm:text-lg">
              CMS Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllData}
              title="Refresh Data"
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors"
            >
              <RefreshCw size={17} className={loadingData ? 'animate-spin' : ''} />
            </button>

            <span className="hidden sm:inline-block text-xs text-neutral-500 font-medium">
              {admin.email}
            </span>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-200 hover:bg-neutral-300 text-neutral-800 transition-colors"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl border text-sm font-medium flex items-center gap-2 animate-in slide-in-from-bottom duration-300 ${
          notification.isError 
            ? 'bg-red-900 text-white border-red-700' 
            : 'bg-neutral-900 text-white border-neutral-700'
        }`}>
          {notification.isError ? <AlertCircle size={16} className="text-red-400" /> : <Check size={16} className="text-emerald-400" />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-black/5">
          {[
            { id: 'messages', label: 'Messages', icon: Mail, badge: unreadCount },
            { id: 'projects', label: 'Projects', icon: FolderKanban, count: projects.length },
            { id: 'thoughts', label: 'Thoughts', icon: BookOpen, count: thoughts.length },
            { id: 'testimonials', label: 'Testimonials', icon: Quote, count: testimonials.length },
            { id: 'settings', label: 'Settings', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-md'
                    : 'bg-white text-neutral-600 hover:text-black hover:bg-neutral-100 border border-black/5'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500 text-white">
                    {tab.badge}
                  </span>
                )}
                {tab.count !== undefined && !tab.badge && (
                  <span className="ml-0.5 text-xs opacity-60">({tab.count})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: MESSAGES / INBOX                                 */}
        {/* ======================================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading">
                  Inquiries &amp; Messages
                </h2>
                <p className="text-sm text-neutral-600">
                  Manage incoming client messages submitted via your portfolio contact form.
                </p>
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="bg-white rounded-[28px] p-12 text-center border border-black/5">
                <Mail size={40} className="mx-auto text-neutral-400 mb-3" />
                <h3 className="text-lg font-bold">No messages received yet</h3>
                <p className="text-neutral-500 text-sm mt-1">
                  When someone submits the contact form, their message will appear right here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`bg-white rounded-[24px] p-6 sm:p-8 border transition-all ${
                      msg.status === 'unread'
                        ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                        : 'border-black/5 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg sm:text-xl font-bold text-[#111111]">
                            {msg.name}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                            msg.status === 'unread'
                              ? 'bg-emerald-100 text-emerald-800'
                              : msg.status === 'replied'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {msg.status}
                          </span>
                        </div>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-sm text-neutral-600 hover:text-black font-medium underline underline-offset-2 mt-0.5 inline-block"
                        >
                          {msg.email}
                        </a>
                      </div>

                      <div className="text-xs text-neutral-400 sm:text-right">
                        {new Date(msg.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    {msg.project && (
                      <div className="bg-neutral-50 rounded-xl p-4 mb-4 border border-black/5">
                        <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                          Project Details / Scope:
                        </div>
                        <p className="text-sm text-neutral-800 font-medium whitespace-pre-wrap">
                          {msg.project}
                        </p>
                      </div>
                    )}

                    {msg.message && (
                      <div className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed mb-6">
                        {msg.message}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100 gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        {msg.status !== 'read' && (
                          <button
                            onClick={() => handleUpdateMessageStatus(msg._id, 'read')}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                          >
                            Mark Read
                          </button>
                        )}
                        {msg.status !== 'replied' && (
                          <button
                            onClick={() => handleUpdateMessageStatus(msg._id, 'replied')}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                          >
                            Mark Replied
                          </button>
                        )}
                        <a
                          href={`mailto:${msg.email}?subject=Re: Your Project Inquiry`}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors inline-flex items-center gap-1"
                        >
                          <span>Reply to Client</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>

                      <button
                        onClick={() => handleDeleteMessage(msg._id)}
                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PROJECTS MANAGEMENT                              */}
        {/* ======================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading">
                  Projects ({projects.length})
                </h2>
                <p className="text-sm text-neutral-600">
                  Add, edit, and organize projects showcased in the Featured Projects and Work section.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalType('project');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111111] text-white text-sm font-semibold hover:bg-neutral-800 transition-all shadow-md self-start sm:self-auto"
              >
                <Plus size={16} />
                <span>Add New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id || project.id}
                  className="bg-white rounded-[24px] overflow-hidden border border-black/5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] bg-neutral-200 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-neutral-800 shadow-sm">
                        {project.year || '2025'}
                      </span>
                    </div>

                    <div className="p-5">
                      <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                        {project.category}
                      </span>
                      <h3 className="text-xl font-bold text-[#111111]">
                        {project.title}
                      </h3>
                      <p className="text-xs text-neutral-600 line-clamp-2 mt-2">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between border-t border-neutral-100 mt-4">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-neutral-600 hover:text-black inline-flex items-center gap-1"
                      >
                        <span>Preview</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : <span />}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(project);
                          setModalType('project');
                        }}
                        className="p-2 rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
                        title="Edit Project"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('project', project._id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: THOUGHTS / BLOG MANAGEMENT                       */}
        {/* ======================================================== */}
        {activeTab === 'thoughts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading">
                  Thoughts &amp; Articles ({thoughts.length})
                </h2>
                <p className="text-sm text-neutral-600">
                  Publish articles, design perspectives, and thoughts.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalType('thought');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111111] text-white text-sm font-semibold hover:bg-neutral-800 transition-all shadow-md self-start sm:self-auto"
              >
                <Plus size={16} />
                <span>Write New Thought</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {thoughts.map((thought) => (
                <div
                  key={thought._id || thought.id}
                  className="bg-white rounded-[24px] overflow-hidden border border-black/5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] bg-neutral-200 overflow-hidden">
                      <img
                        src={thought.image}
                        alt={thought.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-neutral-800 shadow-sm">
                        {thought.date}
                      </span>
                    </div>

                    <div className="p-5">
                      <span className="text-xs font-medium text-neutral-500 block mb-1">
                        {thought.readTime}
                      </span>
                      <h3 className="text-lg font-bold text-[#111111] line-clamp-1">
                        {thought.title}
                      </h3>
                      <p className="text-xs text-neutral-600 line-clamp-2 mt-2">
                        {thought.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-end gap-2 border-t border-neutral-100 mt-4">
                    <button
                      onClick={() => {
                        setEditingItem(thought);
                        setModalType('thought');
                      }}
                      className="p-2 rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
                      title="Edit Thought"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem('thought', thought._id)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Thought"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: TESTIMONIALS MANAGEMENT                          */}
        {/* ======================================================== */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading">
                  Testimonials ({testimonials.length})
                </h2>
                <p className="text-sm text-neutral-600">
                  Manage client reviews and testimonials displayed on your homepage.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalType('testimonial');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111111] text-white text-sm font-semibold hover:bg-neutral-800 transition-all shadow-md self-start sm:self-auto"
              >
                <Plus size={16} />
                <span>Add Testimonial</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((test) => (
                <div
                  key={test._id || test.id}
                  className="bg-white rounded-[24px] p-6 border border-black/5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <p className="text-sm sm:text-base text-neutral-700 italic mb-6">
                    "{test.quote}"
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-3">
                      {test.avatar && (
                        <img
                          src={test.avatar}
                          alt={test.name}
                          className="w-10 h-10 rounded-full object-cover border border-black/5"
                        />
                      )}
                      <div>
                        <h4 className="font-bold text-sm text-[#111111]">
                          {test.name}
                        </h4>
                        <p className="text-xs text-neutral-500">
                          {test.role} {test.company ? `• ${test.company}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(test);
                          setModalType('testimonial');
                        }}
                        className="p-2 rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('testimonial', test._id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: SETTINGS & PASSWORD                              */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading">
                Admin Settings
              </h2>
              <p className="text-sm text-neutral-600">
                Update credentials and manage your portfolio deployment status.
              </p>
            </div>

            <div className="bg-white rounded-[28px] p-8 border border-black/5 shadow-sm">
              <h3 className="text-lg font-bold mb-4 font-heading">
                Change Password
              </h3>

              {passwordNotice && (
                <div className={`p-3.5 rounded-xl mb-4 text-xs sm:text-sm ${
                  passwordNotice.isError ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {passwordNotice.msg}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  Update Password
                </button>
              </form>
            </div>

            <div className="bg-white rounded-[28px] p-8 border border-black/5 shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-heading">
                Backend Status &amp; Integration
              </h3>
              <div className="space-y-2 text-sm text-neutral-600">
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span>Logged in as:</span>
                  <strong className="text-black">{admin.email}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span>Architecture:</span>
                  <span className="text-black font-medium">Vercel Serverless + Express + MongoDB</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span>Contact Email Service:</span>
                  <span className="text-black font-medium">Nodemailer (Configured in .env)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* EDIT / CREATE MODAL                                      */}
      {/* ======================================================== */}
      {modalType && (
        <EntityModal
          type={modalType}
          initialData={editingItem}
          token={token}
          uploadingImage={uploadingImage}
          onUploadImage={handleImageUpload}
          onClose={() => {
            setModalType(null);
            setEditingItem(null);
          }}
          onSaved={() => {
            setModalType(null);
            setEditingItem(null);
            fetchAllData();
            showNotice('Saved successfully!');
          }}
        />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// REUSABLE ENTITY MODAL (PROJECT, THOUGHT, TESTIMONIAL)
// -------------------------------------------------------------
function EntityModal({ type, initialData, token, onClose, onSaved, uploadingImage, onUploadImage }) {
  const [formData, setFormData] = useState(
    initialData || (
      type === 'project'
        ? { title: '', category: '', image: '', link: '', description: '', year: '2025', featured: true }
        : type === 'thought'
        ? { title: '', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), readTime: '5 min read', image: '', description: '', content: '' }
        : { name: '', role: '', company: '', quote: '', avatar: '' }
    )
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const endpointMap = {
      project: initialData?._id ? `/api/projects/${initialData._id}` : '/api/projects',
      thought: initialData?._id ? `/api/thoughts/${initialData._id}` : '/api/thoughts',
      testimonial: initialData?._id ? `/api/testimonials/${initialData._id}` : '/api/testimonials',
    };

    try {
      const res = await fetch(endpointMap[type], {
        method: initialData?._id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-[32px] p-6 sm:p-8 shadow-2xl my-8 relative">
        <h3 className="text-xl sm:text-2xl font-bold font-heading mb-6 capitalize">
          {initialData ? `Edit ${type}` : `Add New ${type}`}
        </h3>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs sm:text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PROJECT FORM FIELDS */}
          {type === 'project' && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. NextGen Studio"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. SaaS Framer Template"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2025"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Project Image (URL or Upload)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... or upload"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold cursor-pointer shrink-0 inline-flex items-center gap-1.5 transition-colors">
                    <Upload size={14} />
                    <span>{uploadingImage ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onUploadImage(e, (url) => setFormData((prev) => ({ ...prev, image: url })))}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Live Website URL</label>
                <input
                  type="url"
                  value={formData.link || ''}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief overview of the project..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>
            </>
          )}

          {/* THOUGHT FORM FIELDS */}
          {type === 'thought' && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Article Title"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. May 10, 2025"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Cover Image (URL or Upload)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... or upload"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold cursor-pointer shrink-0 inline-flex items-center gap-1.5 transition-colors">
                    <Upload size={14} />
                    <span>{uploadingImage ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onUploadImage(e, (url) => setFormData((prev) => ({ ...prev, image: url })))}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Short Excerpt / Description</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short one-line summary..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Article Content</label>
                <textarea
                  rows={6}
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your article thoughts and story here..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>
            </>
          )}

          {/* TESTIMONIAL FORM FIELDS */}
          {type === 'testimonial' && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Role / Position</label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Design Lead"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Company</label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Acme Studio"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Avatar Photo (URL or Upload)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.avatar || ''}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold cursor-pointer shrink-0 inline-flex items-center gap-1.5 transition-colors">
                    <Upload size={14} />
                    <span>{uploadingImage ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onUploadImage(e, (url) => setFormData((prev) => ({ ...prev, avatar: url })))}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Quote / Review</label>
                <textarea
                  rows={4}
                  required
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="What did the client say about your work?"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-neutral-900 text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

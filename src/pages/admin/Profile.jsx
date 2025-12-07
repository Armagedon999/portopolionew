import { useState, useEffect } from 'react';
import { Save, User, Mail, MapPin, Phone, Github, Linkedin, Globe, FileText } from 'lucide-react';
import { db } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
    website_url: '',
    resume_url: '',
    hero_title: '',
    hero_subtitle: '',
    hero_description: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data, error } = await db.getProfile();
      if (error) throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          title: data.title || '',
          bio: data.bio || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          twitter_url: data.twitter_url || '',
          website_url: data.website_url || '',
          resume_url: data.resume_url || '',
          hero_title: data.hero_title || '',
          hero_subtitle: data.hero_subtitle || '',
          hero_description: data.hero_description || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await db.updateProfile(profile);
      if (error) throw error;
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-base-content mb-2">Profile Management</h1>
          <p className="text-base-content/70">
            Update your personal information and portfolio details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20">
            <h2 className="text-xl font-bold text-base-content mb-6 flex items-center">
              <User className="w-6 h-6 mr-2 text-primary" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Full Name *</span>
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Professional Title *</span>
                </label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="e.g., Full Stack Developer"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">Bio</span>
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="textarea textarea-bordered w-full"
                  rows={4}
                  placeholder="Tell us about yourself, your experience, and what you do..."
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20">
            <h2 className="text-xl font-bold text-base-content mb-6 flex items-center">
              <Mail className="w-6 h-6 mr-2 text-secondary" />
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Phone</span>
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">Location</span>
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20">
            <h2 className="text-xl font-bold text-base-content mb-6 flex items-center">
              <Globe className="w-6 h-6 mr-2 text-accent" />
              Social Links
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <span className="label-text font-semibold flex items-center">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </span>
                </label>
                <input
                  type="url"
                  value={profile.github_url}
                  onChange={(e) => handleChange('github_url', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold flex items-center">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </span>
                </label>
                <input
                  type="url"
                  value={profile.linkedin_url}
                  onChange={(e) => handleChange('linkedin_url', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Twitter</span>
                </label>
                <input
                  type="url"
                  value={profile.twitter_url}
                  onChange={(e) => handleChange('twitter_url', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Website</span>
                </label>
                <input
                  type="url"
                  value={profile.website_url}
                  onChange={(e) => handleChange('website_url', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Resume/CV URL
                  </span>
                </label>
                <input
                  type="url"
                  value={profile.resume_url}
                  onChange={(e) => handleChange('resume_url', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="https://example.com/resume.pdf"
                />
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20">
            <h2 className="text-xl font-bold text-base-content mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-success" />
              Hero Section Content
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Hero Title</span>
                </label>
                <input
                  type="text"
                  value={profile.hero_title}
                  onChange={(e) => handleChange('hero_title', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Hi, I'm John Developer"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Hero Subtitle</span>
                </label>
                <input
                  type="text"
                  value={profile.hero_subtitle}
                  onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Full Stack Web Developer"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Hero Description</span>
                </label>
                <textarea
                  value={profile.hero_description}
                  onChange={(e) => handleChange('hero_description', e.target.value)}
                  className="textarea textarea-bordered w-full"
                  rows={3}
                  placeholder="I create amazing digital experiences with modern technologies..."
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Profile;
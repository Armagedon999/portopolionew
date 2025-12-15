import { useState, useEffect } from 'react';
import { Save, User, Mail, MapPin, Phone, Github, Linkedin, Globe, FileText, Image as ImageIcon, Upload, X } from 'lucide-react';
import { db, storage } from '../../lib/supabase';
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
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await db.getProfile();
      
      if (error) {
        console.error('Error loading profile:', error);
        toast.error(`Failed to load profile data: ${error.message || 'Unknown error'}`);
        // Set empty profile to allow editing
        setProfileData(null);
        setProfile({
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
        return;
      }
      
      if (data) {
        // Store full profile data for image references
        setProfileData(data);
        
        // Set form data
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
      } else {
        // No profile data exists, set empty form
        setProfileData(null);
        setProfile({
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
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error(`Failed to load profile data: ${error.message || 'Unknown error'}`);
      // Set empty profile to allow editing
      setProfileData(null);
      setProfile({
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
      // Reload profile data to get updated images
      await loadProfile();
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

  const handleCVFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document (.pdf, .doc, .docx)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setCvFile(file);
  };

  const handleCVUpload = async () => {
    if (!cvFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploadingCV(true);
    try {
      // Generate unique filename
      const fileExt = cvFile.name.split('.').pop();
      const fileName = `cv_${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await storage.uploadFile('portfolio-files', filePath, cvFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const publicUrl = storage.getPublicUrl('portfolio-files', filePath);

      // Update profile with new CV URL
      const updatedProfile = { ...profile, resume_url: publicUrl };
      const { error: updateError } = await db.updateProfile(updatedProfile);

      if (updateError) {
        throw updateError;
      }

      setProfile(updatedProfile);
      setCvFile(null);
      toast.success('CV uploaded successfully!');
      
      // Reset file input
      const fileInput = document.getElementById('cv-file-input');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast.error(`Failed to upload CV: ${error.message || 'Unknown error'}`);
    } finally {
      setUploadingCV(false);
    }
  };

  const handleRemoveCV = async () => {
    if (!profile.resume_url) return;

    try {
      // Extract file path from Supabase storage URL
      // URL format: https://[project].supabase.co/storage/v1/object/public/cv/resumes/filename.pdf
      try {
        const url = new URL(profile.resume_url);
        const pathParts = url.pathname.split('/').filter(part => part);
        
        // Find index of 'public' and get path after it (should be portfolio-files/resumes/filename.pdf)
        const publicIndex = pathParts.findIndex(part => part === 'public');
        if (publicIndex !== -1 && publicIndex < pathParts.length - 1) {
          // Get path after 'public' (skip 'portfolio-files' bucket name, get the rest)
          const pathAfterPublic = pathParts.slice(publicIndex + 1);
          if (pathAfterPublic.length > 1) {
            // Remove 'portfolio-files' bucket name, keep the rest (resumes/filename.pdf)
            const filePath = pathAfterPublic.slice(1).join('/');
            
            // Delete file from storage
            const { error: deleteError } = await storage.deleteFile('portfolio-files', filePath);
            if (deleteError) {
              console.warn('Error deleting file from storage:', deleteError);
              // Continue to remove URL from profile even if file deletion fails
            }
          }
        }
      } catch (urlError) {
        console.warn('Could not parse CV URL for deletion:', urlError);
        // Continue to remove URL from profile even if we can't parse the URL
      }

      // Update profile to remove CV URL
      const updatedProfile = { ...profile, resume_url: '' };
      const { error } = await db.updateProfile(updatedProfile);

      if (error) throw error;

      setProfile(updatedProfile);
      toast.success('CV removed successfully!');
    } catch (error) {
      console.error('Error removing CV:', error);
      toast.error(`Failed to remove CV: ${error.message || 'Unknown error'}`);
    }
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
                    Resume/CV
                  </span>
                </label>
                
                {/* CV Upload Section */}
                <div className="space-y-4">
                  {/* File Upload Input */}
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        id="cv-file-input"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleCVFileChange}
                        className="file-input file-input-bordered w-full"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleCVUpload}
                      disabled={!cvFile || uploadingCV}
                      className="btn btn-primary"
                    >
                      {uploadingCV ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload CV
                        </>
                      )}
                    </button>
                  </div>

                  {/* Current CV Display */}
                  {profile.resume_url && (
                    <div className="p-4 bg-base-200 rounded-lg border border-base-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-semibold text-sm">Current CV</p>
                            <a
                              href={profile.resume_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline break-all"
                            >
                              {profile.resume_url}
                            </a>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCV}
                          className="btn btn-sm btn-ghost text-error"
                          title="Remove CV"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Manual URL Input (Alternative) */}
                  <div>
                    <label className="label">
                      <span className="label-text text-sm text-base-content/70">
                        Or enter CV URL manually
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
            </div>
          </div>

          {/* Current Images Preview */}
          <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20">
            <h2 className="text-xl font-bold text-base-content mb-6 flex items-center">
              <ImageIcon className="w-6 h-6 mr-2 text-primary" />
              Current Images
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hero Image */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Hero Image</span>
                </label>
                <div className="relative w-full h-48 bg-base-200 rounded-lg overflow-hidden">
                  {profileData?.hero_image?.url ? (
                    <img
                      src={profileData.hero_image.url}
                      alt={profileData.hero_image.alt_text || 'Hero Image'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-base-content/30 mx-auto mb-2" />
                        <p className="text-sm text-base-content/60">No hero image set</p>
                        <p className="text-xs text-base-content/40 mt-1">Set it in Image Management</p>
                      </div>
                    </div>
                  )}
                </div>
                {profileData?.hero_image && (
                  <p className="text-xs text-base-content/60 mt-2">
                    {profileData.hero_image.name}
                  </p>
                )}
              </div>

              {/* About Image */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">About Image</span>
                </label>
                <div className="relative w-full h-48 bg-base-200 rounded-lg overflow-hidden">
                  {profileData?.about_image?.url ? (
                    <img
                      src={profileData.about_image.url}
                      alt={profileData.about_image.alt_text || 'About Image'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-base-content/30 mx-auto mb-2" />
                        <p className="text-sm text-base-content/60">No about image set</p>
                        <p className="text-xs text-base-content/40 mt-1">Set it in Image Management</p>
                      </div>
                    </div>
                  )}
                </div>
                {profileData?.about_image && (
                  <p className="text-xs text-base-content/60 mt-2">
                    {profileData.about_image.name}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 p-3 bg-info/10 rounded-lg">
              <p className="text-sm text-base-content/70">
                <strong>Note:</strong> To change images, go to <strong>Image Management</strong> and set images as Hero or About.
              </p>
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
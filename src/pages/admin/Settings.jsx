import { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, Moon, Sun, Database, Shield, Palette } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    site_title: 'My Portfolio',
    site_description: 'A modern portfolio website',
    maintenance_mode: false,
    analytics_enabled: false,
    contact_form_enabled: true,
    max_file_size: 5, // MB
    allowed_file_types: 'jpg,jpeg,png,gif,svg,pdf',
    email_notifications: true,
    auto_backup: false
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('portfolio_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Save settings to localStorage (in real app, save to database)
      localStorage.setItem('portfolio_settings', JSON.stringify(settings));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        site_title: 'My Portfolio',
        site_description: 'A modern portfolio website',
        maintenance_mode: false,
        analytics_enabled: false,
        contact_form_enabled: true,
        max_file_size: 5,
        allowed_file_types: 'jpg,jpeg,png,gif,svg,pdf',
        email_notifications: true,
        auto_backup: false
      });
      toast.success('Settings reset to defaults');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-base-content mb-2">Settings</h1>
          <p className="text-base-content/70">
            Configure your portfolio website settings and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Settings */}
          <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20">
            <h2 className="text-xl font-bold text-base-content mb-6 flex items-center">
              <SettingsIcon className="w-6 h-6 mr-2 text-primary" />
              General Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Site Title</span>
                </label>
                <input
                  type="text"
                  value={settings.site_title}
                  onChange={(e) => handleChange('site_title', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="My Portfolio"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Site Description</span>
                </label>
                <input
                  type="text"
                  value={settings.site_description}
                  onChange={(e) => handleChange('site_description', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="A modern portfolio website"
                />
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20">
            <h2 className="text-xl font-bold text-base-content mb-6 flex items-center">
              <Palette className="w-6 h-6 mr-2 text-secondary" />
              Appearance
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-base-200/50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-base-content">Theme</h3>
                  <p className="text-sm text-base-content/70">
                    Switch between light and dark mode
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-base-content/70">
                    {theme === 'light' ? 'Light' : 'Dark'}
                  </span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="btn btn-outline btn-sm"
                  >
                    {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    Switch
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Settings */}
          <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20">
            <h2 className="text-xl font-bold text-base-content mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-accent" />
              Features
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-base-200/50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-base-content">Maintenance Mode</h3>
                  <p className="text-sm text-base-content/70">
                    Temporarily disable public access to your portfolio
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenance_mode}
                  onChange={(e) => handleChange('maintenance_mode', e.target.checked)}
                  className="toggle toggle-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-base-200/50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-base-content">Analytics</h3>
                  <p className="text-sm text-base-content/70">
                    Enable website analytics and visitor tracking
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.analytics_enabled}
                  onChange={(e) => handleChange('analytics_enabled', e.target.checked)}
                  className="toggle toggle-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-base-200/50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-base-content">Contact Form</h3>
                  <p className="text-sm text-base-content/70">
                    Allow visitors to send messages through the contact form
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.contact_form_enabled}
                  onChange={(e) => handleChange('contact_form_enabled', e.target.checked)}
                  className="toggle toggle-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-base-200/50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-base-content">Email Notifications</h3>
                  <p className="text-sm text-base-content/70">
                    Receive email notifications for new messages
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.email_notifications}
                  onChange={(e) => handleChange('email_notifications', e.target.checked)}
                  className="toggle toggle-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-base-200/50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-base-content">Auto Backup</h3>
                  <p className="text-sm text-base-content/70">
                    Automatically backup your portfolio data
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.auto_backup}
                  onChange={(e) => handleChange('auto_backup', e.target.checked)}
                  className="toggle toggle-primary"
                />
              </div>
            </div>
          </div>

          {/* File Upload Settings */}
          <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20">
            <h2 className="text-xl font-bold text-base-content mb-6 flex items-center">
              <Database className="w-6 h-6 mr-2 text-success" />
              File Upload Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Max File Size (MB)</span>
                </label>
                <input
                  type="number"
                  value={settings.max_file_size}
                  onChange={(e) => handleChange('max_file_size', parseInt(e.target.value))}
                  className="input input-bordered w-full"
                  min="1"
                  max="100"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Allowed File Types</span>
                </label>
                <input
                  type="text"
                  value={settings.allowed_file_types}
                  onChange={(e) => handleChange('allowed_file_types', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="jpg,jpeg,png,gif,svg,pdf"
                />
                <label className="label">
                  <span className="label-text-alt">Comma-separated file extensions</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={resetToDefaults}
              className="btn btn-outline"
            >
              Reset to Defaults
            </button>
            
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
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Settings;
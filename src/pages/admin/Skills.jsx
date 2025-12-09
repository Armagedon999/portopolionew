import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Code, Star, Upload, Image as ImageIcon } from 'lucide-react';
import { db, storage } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    icon_url: '',
    color: '#3B82F6',
    sort_order: 0,
    is_featured: false
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState([
    'Frontend',
    'Backend',
    'Database',
    'Cloud',
    'DevOps',
    'Mobile',
    'Design',
    'Tools',
    'Other'
  ]);

  const colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Teal', value: '#14B8A6' }
  ];

  useEffect(() => {
    loadSkills();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await db.getSkillCategories();
      if (error) {
        console.warn('Error loading categories, using defaults:', error);
        return;
      }
      if (data && data.length > 0) {
        const categoryNames = data.map(cat => cat.name);
        setCategories([...categoryNames, 'Other']);
      }
    } catch (error) {
      console.warn('Error loading categories:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    if (categories.includes(newCategoryName.trim())) {
      toast.error('Category already exists');
      return;
    }

    try {
      const { error } = await db.createSkillCategory({
        name: newCategoryName.trim(),
        description: '',
        icon_name: 'Tool',
        color: '#3B82F6',
        sort_order: categories.length
      });

      if (error) throw error;

      toast.success('Category added successfully!');
      setFormData({ ...formData, category: newCategoryName.trim() });
      setNewCategoryName('');
      setShowCategoryModal(false);
      await loadCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(`Failed to add category: ${error.message || 'Please try again.'}`);
    }
  };

  const loadSkills = async () => {
    try {
      const { data, error } = await db.getSkills();
      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error loading skills:', error);
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setUploading(true);

    try {
      let iconUrl = formData.icon_url;

      // If a new file is selected, upload it to Supabase storage
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `skills/${fileName}`;

        // Upload file to Supabase storage
        const { data: uploadData, error: uploadError } = await storage.uploadFile('images', filePath, selectedFile);
        
        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        iconUrl = storage.getPublicUrl('images', filePath);

        // If editing and there's an old icon, delete it from storage
        if (editingSkill && editingSkill.icon_url && editingSkill.icon_url.includes('supabase')) {
          try {
            // Extract path from URL - handle different URL formats
            let oldPath = null;
            if (editingSkill.icon_url.includes('/storage/v1/object/public/images/')) {
              const urlParts = editingSkill.icon_url.split('/storage/v1/object/public/images/');
              if (urlParts.length > 1) {
                oldPath = urlParts[1].split('?')[0]; // Remove query params if any
              }
            } else if (editingSkill.icon_url.includes('/storage/v1/object/sign/images/')) {
              // Handle signed URLs
              const urlParts = editingSkill.icon_url.split('/storage/v1/object/sign/images/');
              if (urlParts.length > 1) {
                oldPath = urlParts[1].split('?')[0].split('&')[0]; // Remove query params
              }
            }
            
            if (oldPath) {
              await storage.deleteFile('images', oldPath);
            }
          } catch (deleteError) {
            console.warn('Error deleting old icon:', deleteError);
            // Continue even if deletion fails
          }
        }
      }

      // Update formData with the new URL (or keep existing if editing without new file)
      const skillData = {
        ...formData,
        icon_url: iconUrl || editingSkill?.icon_url
      };

      if (editingSkill) {
        await db.updateSkill(editingSkill.id, skillData);
        toast.success('Skill updated successfully!');
      } else {
        await db.createSkill(skillData);
        toast.success('Skill created successfully!');
      }

      await loadSkills();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving skill:', error);
      toast.error(`Failed to save skill: ${error.message || 'Please try again.'}`);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      icon_url: skill.icon_url || '',
      color: skill.color,
      sort_order: skill.sort_order,
      is_featured: skill.is_featured
    });
    setSelectedFile(null);
    setPreviewUrl(skill.icon_url || null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      // Find the skill to get its icon URL
      const skillToDelete = skills.find(s => s.id === id);
      
      // Delete from database
      await db.deleteSkill(id);
      
      // Delete from storage if it's a Supabase storage URL
      if (skillToDelete?.icon_url && skillToDelete.icon_url.includes('supabase')) {
        try {
          // Extract path from URL - handle different URL formats
          let filePath = null;
          if (skillToDelete.icon_url.includes('/storage/v1/object/public/images/')) {
            const urlParts = skillToDelete.icon_url.split('/storage/v1/object/public/images/');
            if (urlParts.length > 1) {
              filePath = urlParts[1].split('?')[0]; // Remove query params if any
            }
          } else if (skillToDelete.icon_url.includes('/storage/v1/object/sign/images/')) {
            // Handle signed URLs
            const urlParts = skillToDelete.icon_url.split('/storage/v1/object/sign/images/');
            if (urlParts.length > 1) {
              filePath = urlParts[1].split('?')[0].split('&')[0]; // Remove query params
            }
          }
          
          if (filePath) {
            await storage.deleteFile('images', filePath);
          }
        } catch (deleteError) {
          console.warn('Error deleting icon from storage:', deleteError);
          // Continue even if storage deletion fails
        }
      }
      
      await loadSkills();
      toast.success('Skill deleted successfully!');
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error(`Failed to delete skill: ${error.message || 'Please try again.'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Frontend',
      icon_url: '',
      color: '#3B82F6',
      sort_order: 0,
      is_featured: false
    });
    setEditingSkill(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 2MB for icons)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFeatured = async (skill) => {
    try {
      await db.updateSkill(skill.id, { is_featured: !skill.is_featured });
      await loadSkills();
      toast.success('Skill updated successfully!');
    } catch (error) {
      console.error('Error updating skill:', error);
      toast.error('Failed to update skill');
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2">Skills Management</h1>
            <p className="text-base-content/70">
              Manage your technical skills and competencies
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5" />
            Add Skill
          </button>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className={`bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20 hover:shadow-xl transition-all ${
                skill.is_featured ? 'ring-2 ring-primary/20' : ''
              }`}
            >
              {/* Skill Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: skill.color }}
                  >
                    {skill.icon_url ? (
                      <img src={skill.icon_url} alt={skill.name} className="w-8 h-8" />
                    ) : (
                      <Code className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content">{skill.name}</h3>
                    <span className="text-sm text-base-content/70">{skill.category}</span>
                  </div>
                </div>
                {skill.is_featured && (
                  <Star className="w-5 h-5 text-primary fill-current" />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(skill)}
                  className="btn btn-sm btn-outline flex-1"
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => toggleFeatured(skill)}
                  className={`btn btn-sm flex-1 ${
                    skill.is_featured ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(skill.id)}
                  className="btn btn-sm btn-error"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {skills.length === 0 && (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-base-content mb-2">No Skills Found</h3>
            <p className="text-base-content/70 mb-4">
              Get started by adding your first skill
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5" />
              Add Skill
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-base-content">
                  {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Skill Name *</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Category *</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === 'Other') {
                          setShowCategoryModal(true);
                        } else {
                          setFormData({ ...formData, category: e.target.value });
                        }
                      }}
                      className="select select-bordered w-full"
                      required
                    >
                      {categories.filter(cat => cat !== 'Other').map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                      <option value="Other">Other (Add New)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Technology Logo *</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full"
                  />
                  <p className="text-xs text-base-content/60 mt-2">
                    {editingSkill ? 'Leave empty to keep current logo, or upload a new one' : 'Select a logo image file (max 2MB)'}
                  </p>
                  
                  {/* Preview */}
                  {(previewUrl || (editingSkill && editingSkill.icon_url && !selectedFile)) && (
                    <div className="mt-4">
                      <label className="label">
                        <span className="label-text">Preview</span>
                      </label>
                      <div className="relative w-24 h-24 bg-base-200 rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={previewUrl || editingSkill.icon_url}
                          alt="Preview"
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Fallback: Manual URL input (optional) */}
                  <div className="mt-4">
                    <label className="label">
                      <span className="label-text text-xs">Or enter logo URL manually (optional)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.icon_url}
                      onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                      className="input input-bordered w-full input-sm"
                      placeholder="https://example.com/icon.svg"
                      disabled={!!selectedFile}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Color</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`w-12 h-12 rounded-lg border-2 ${
                          formData.color === color.value ? 'border-primary' : 'border-base-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Sort Order</span>
                    </label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                      className="input input-bordered w-full"
                      min="0"
                    />
                  </div>

                  <div className="flex items-center space-x-4 pt-8">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="checkbox checkbox-primary"
                      />
                      <span className="label-text">Featured</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving || uploading}
                  >
                    {(saving || uploading) ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        {uploading ? 'Uploading...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {editingSkill ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-base-content">
                  Add New Category
                </h2>
                <button
                  onClick={() => {
                    setShowCategoryModal(false);
                    setNewCategoryName('');
                    setFormData({ ...formData, category: 'Frontend' });
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Category Name *</span>
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="e.g., AI/ML, Blockchain, etc."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    autoFocus
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryModal(false);
                      setNewCategoryName('');
                      setFormData({ ...formData, category: 'Frontend' });
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="btn btn-primary"
                  >
                    <Save className="w-5 h-5" />
                    Add Category
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Skills;
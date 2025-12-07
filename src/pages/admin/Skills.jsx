import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Code, Star } from 'lucide-react';
import { db } from '../../lib/supabase';
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
    level: 80,
    icon_url: '',
    color: '#3B82F6',
    sort_order: 0,
    is_featured: false
  });

  const categories = [
    'Frontend',
    'Backend',
    'Database',
    'Cloud',
    'DevOps',
    'Mobile',
    'Design',
    'Tools',
    'Other'
  ];

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
  }, []);

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

    try {
      if (editingSkill) {
        await db.updateSkill(editingSkill.id, formData);
        toast.success('Skill updated successfully!');
      } else {
        await db.createSkill(formData);
        toast.success('Skill created successfully!');
      }

      await loadSkills();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving skill:', error);
      toast.error('Failed to save skill');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon_url: skill.icon_url || '',
      color: skill.color,
      sort_order: skill.sort_order,
      is_featured: skill.is_featured
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      await db.deleteSkill(id);
      await loadSkills();
      toast.success('Skill deleted successfully!');
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Frontend',
      level: 80,
      icon_url: '',
      color: '#3B82F6',
      sort_order: 0,
      is_featured: false
    });
    setEditingSkill(null);
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

              {/* Skill Level */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-base-content/70">Proficiency</span>
                  <span className="font-semibold">{skill.level}%</span>
                </div>
                <div className="w-full bg-base-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${skill.level}%`,
                      backgroundColor: skill.color
                    }}
                  ></div>
                </div>
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
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="select select-bordered w-full"
                      required
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Proficiency Level: {formData.level}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    className="range range-primary"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Icon URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.icon_url}
                    onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                    className="input input-bordered w-full"
                    placeholder="https://example.com/icon.svg"
                  />
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
    </AdminLayout>
  );
};

export default Skills;
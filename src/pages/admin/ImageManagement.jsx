import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  Eye,
  EyeOff,
  Save,
  X
} from 'lucide-react';
import { db, storage } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';

const ImageManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    alt_text: '',
    section: 'hero',
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [imagesRes, profileRes] = await Promise.all([
        db.getAllImages(),
        db.getProfile()
      ]);

      setImages(imagesRes.data || []);
      setProfile(profileRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (editingImage) {
        await db.updateImage(editingImage.id, formData);
      } else {
        await db.createImage(formData);
      }

      await loadData();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Error saving image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      name: image.name,
      description: image.description || '',
      url: image.url,
      alt_text: image.alt_text || '',
      section: image.section,
      is_active: image.is_active,
      sort_order: image.sort_order
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await db.deleteImage(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image. Please try again.');
    }
  };

  const handleSetAsHero = async (imageId) => {
    try {
      await db.updateProfileImages(imageId, profile?.about_image_id);
      await loadData();
    } catch (error) {
      console.error('Error setting hero image:', error);
      alert('Error setting hero image. Please try again.');
    }
  };

  const handleSetAsAbout = async (imageId) => {
    try {
      await db.updateProfileImages(profile?.hero_image_id, imageId);
      await loadData();
    } catch (error) {
      console.error('Error setting about image:', error);
      alert('Error setting about image. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      url: '',
      alt_text: '',
      section: 'hero',
      is_active: true,
      sort_order: 0
    });
    setEditingImage(null);
  };

  const toggleActive = async (image) => {
    try {
      await db.updateImage(image.id, { is_active: !image.is_active });
      await loadData();
    } catch (error) {
      console.error('Error toggling image status:', error);
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

  const sections = [
    { value: 'hero', label: 'Hero Section' },
    { value: 'about', label: 'About Section' },
    { value: 'portfolio', label: 'Portfolio Section' },
    { value: 'general', label: 'General Use' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2">Image Management</h1>
            <p className="text-base-content/70">
              Manage images for Hero, About, and other sections
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
            Add Image
          </button>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className={`bg-base-100 rounded-xl shadow-lg border border-base-300/20 overflow-hidden transition-all hover:shadow-xl ${
                !image.is_active ? 'opacity-50' : ''
              }`}
            >
              {/* Image Preview */}
              <div className="aspect-video bg-base-200 relative overflow-hidden">
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.alt_text || image.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-base-content/30" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`badge badge-sm ${
                    image.is_active ? 'badge-success' : 'badge-error'
                  }`}>
                    {image.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Section Badge */}
                <div className="absolute top-2 right-2">
                  <span className="badge badge-sm badge-outline">
                    {sections.find(s => s.value === image.section)?.label || image.section}
                  </span>
                </div>
              </div>

              {/* Image Info */}
              <div className="p-4">
                <h3 className="font-semibold text-base-content mb-2 truncate">
                  {image.name}
                </h3>
                {image.description && (
                  <p className="text-sm text-base-content/70 mb-3 line-clamp-2">
                    {image.description}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(image)}
                    className="btn btn-sm btn-outline"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => toggleActive(image)}
                    className={`btn btn-sm ${
                      image.is_active ? 'btn-warning' : 'btn-success'
                    }`}
                  >
                    {image.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  {image.section === 'hero' && (
                    <button
                      onClick={() => handleSetAsHero(image.id)}
                      className={`btn btn-sm ${
                        profile?.hero_image_id === image.id ? 'btn-primary' : 'btn-outline'
                      }`}
                    >
                      Set Hero
                    </button>
                  )}

                  {image.section === 'about' && (
                    <button
                      onClick={() => handleSetAsAbout(image.id)}
                      className={`btn btn-sm ${
                        profile?.about_image_id === image.id ? 'btn-primary' : 'btn-outline'
                      }`}
                    >
                      Set About
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(image.id)}
                    className="btn btn-sm btn-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-base-content mb-2">No Images Found</h3>
            <p className="text-base-content/70 mb-4">
              Get started by adding your first image
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5" />
              Add Image
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
                  {editingImage ? 'Edit Image' : 'Add New Image'}
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
                      <span className="label-text">Name *</span>
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
                      <span className="label-text">Section *</span>
                    </label>
                    <select
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="select select-bordered w-full"
                      required
                    >
                      {sections.map((section) => (
                        <option key={section.value} value={section.value}>
                          {section.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Image URL *</span>
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="input input-bordered w-full"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Alt Text</span>
                  </label>
                  <input
                    type="text"
                    value={formData.alt_text}
                    onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                    className="input input-bordered w-full"
                    placeholder="Describe the image for accessibility"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="textarea textarea-bordered w-full"
                    rows={3}
                    placeholder="Optional description of the image"
                  />
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
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="checkbox checkbox-primary"
                      />
                      <span className="label-text">Active</span>
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
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {editingImage ? 'Update' : 'Create'}
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

export default ImageManagement;
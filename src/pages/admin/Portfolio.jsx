import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Briefcase, ExternalLink, Github, Eye, EyeOff, Upload, Image as ImageIcon } from 'lucide-react';
import { db, storage } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    image_url: '',
    demo_url: '',
    repo_url: '',
    tech_stack: [],
    status: 'published',
    is_featured: false,
    sort_order: 0
  });

  const [techInput, setTechInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const statusOptions = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' }
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await db.getProjects(true); // Include unpublished
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate: new projects must have an image (file or URL)
    if (!editingProject && !selectedFile && !formData.image_url) {
      toast.error('Please upload an image or provide an image URL');
      return;
    }
    
    setSaving(true);
    setUploading(true);

    try {
      let imageUrl = formData.image_url;

      // If a new file is selected, upload it to Supabase storage
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        // Upload file to Supabase storage
        const { data: uploadData, error: uploadError } = await storage.uploadFile('portfolio', filePath, selectedFile);
        
        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        imageUrl = storage.getPublicUrl('portfolio', filePath);

        // If editing and there's an old image, delete it from storage
        if (editingProject && editingProject.image_url && editingProject.image_url.includes('supabase')) {
          try {
            // Extract path from URL - handle different URL formats
            let oldPath = null;
            if (editingProject.image_url.includes('/storage/v1/object/public/portfolio/')) {
              const urlParts = editingProject.image_url.split('/storage/v1/object/public/portfolio/');
              if (urlParts.length > 1) {
                oldPath = urlParts[1].split('?')[0]; // Remove query params if any
              }
            } else if (editingProject.image_url.includes('/storage/v1/object/sign/portfolio/')) {
              // Handle signed URLs
              const urlParts = editingProject.image_url.split('/storage/v1/object/sign/portfolio/');
              if (urlParts.length > 1) {
                oldPath = urlParts[1].split('?')[0].split('&')[0]; // Remove query params
              }
            }
            
            if (oldPath) {
              await storage.deleteFile('portfolio', oldPath);
            }
          } catch (deleteError) {
            console.warn('Error deleting old image:', deleteError);
            // Continue even if deletion fails
          }
        }
      }

      // Update formData with the new URL (or keep existing if editing without new file)
      const projectData = {
        ...formData,
        image_url: imageUrl || editingProject?.image_url
      };

      if (editingProject) {
        await db.updateProject(editingProject.id, projectData);
        toast.success('Project updated successfully!');
      } else {
        await db.createProject(projectData);
        toast.success('Project created successfully!');
      }

      await loadProjects();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(`Failed to save project: ${error.message || 'Please try again.'}`);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      short_description: project.short_description || '',
      image_url: project.image_url || '',
      demo_url: project.demo_url || '',
      repo_url: project.repo_url || '',
      tech_stack: project.tech_stack || [],
      status: project.status,
      is_featured: project.is_featured,
      sort_order: project.sort_order
    });
    setSelectedFile(null);
    setPreviewUrl(project.image_url || null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      // Find the project to get its image URL
      const projectToDelete = projects.find(p => p.id === id);
      
      // Delete from database
      await db.deleteProject(id);
      
      // Delete from storage if it's a Supabase storage URL
      if (projectToDelete?.image_url && projectToDelete.image_url.includes('supabase')) {
        try {
          // Extract path from URL - handle different URL formats
          let filePath = null;
          if (projectToDelete.image_url.includes('/storage/v1/object/public/portfolio/')) {
            const urlParts = projectToDelete.image_url.split('/storage/v1/object/public/portfolio/');
            if (urlParts.length > 1) {
              filePath = urlParts[1].split('?')[0]; // Remove query params if any
            }
          } else if (projectToDelete.image_url.includes('/storage/v1/object/sign/portfolio/')) {
            // Handle signed URLs
            const urlParts = projectToDelete.image_url.split('/storage/v1/object/sign/portfolio/');
            if (urlParts.length > 1) {
              filePath = urlParts[1].split('?')[0].split('&')[0]; // Remove query params
            }
          }
          
          if (filePath) {
            await storage.deleteFile('portfolio', filePath);
          }
        } catch (deleteError) {
          console.warn('Error deleting image from storage:', deleteError);
          // Continue even if storage deletion fails
        }
      }
      
      await loadProjects();
      toast.success('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(`Failed to delete project: ${error.message || 'Please try again.'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      short_description: '',
      image_url: '',
      demo_url: '',
      repo_url: '',
      tech_stack: [],
      status: 'published',
      is_featured: false,
      sort_order: 0
    });
    setTechInput('');
    setEditingProject(null);
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
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
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

  const addTechStack = () => {
    if (techInput.trim() && !formData.tech_stack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        tech_stack: [...formData.tech_stack, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const removeTechStack = (tech) => {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack.filter(t => t !== tech)
    });
  };

  const toggleStatus = async (project) => {
    try {
      const newStatus = project.status === 'published' ? 'draft' : 'published';
      await db.updateProject(project.id, { status: newStatus });
      await loadProjects();
      toast.success(`Project ${newStatus === 'published' ? 'published' : 'moved to draft'}!`);
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Failed to update project status');
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
            <h1 className="text-3xl font-bold text-base-content mb-2">Portfolio Management</h1>
            <p className="text-base-content/70">
              Manage your projects and showcase your work
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
            Add Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`bg-base-100 rounded-xl shadow-lg border border-base-300/20 overflow-hidden hover:shadow-xl transition-all ${
                project.is_featured ? 'ring-2 ring-primary/20' : ''
              } ${project.status === 'draft' ? 'opacity-75' : ''}`}
            >
              {/* Project Image */}
              <div className="aspect-video bg-base-200 relative overflow-hidden">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Briefcase className="w-12 h-12 text-base-content/30" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`badge badge-sm ${
                    project.status === 'published' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {project.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Featured Badge */}
                {project.is_featured && (
                  <div className="absolute top-2 right-2">
                    <span className="badge badge-sm badge-primary">Featured</span>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="font-semibold text-base-content mb-2 line-clamp-1">
                  {project.title}
                </h3>
                
                {project.short_description && (
                  <p className="text-sm text-base-content/70 mb-3 line-clamp-2">
                    {project.short_description}
                  </p>
                )}

                {/* Tech Stack */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tech_stack.slice(0, 3).map((tech, index) => (
                      <span key={index} className="badge badge-outline badge-sm">
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 3 && (
                      <span className="badge badge-outline badge-sm">
                        +{project.tech_stack.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="btn btn-sm btn-outline flex-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => toggleStatus(project)}
                    className={`btn btn-sm flex-1 ${
                      project.status === 'published' ? 'btn-warning' : 'btn-success'
                    }`}
                  >
                    {project.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDelete(project.id)}
                    className="btn btn-sm btn-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Links */}
                <div className="flex gap-2 mt-3">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-xs btn-outline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Demo
                    </a>
                  )}
                  {project.repo_url && (
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-xs btn-outline"
                    >
                      <Github className="w-3 h-3" />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-base-content mb-2">No Projects Found</h3>
            <p className="text-base-content/70 mb-4">
              Get started by adding your first project
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5" />
              Add Project
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-base-content">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
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
                      <span className="label-text">Project Title *</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Status</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="select select-bordered w-full"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Short Description</span>
                  </label>
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    className="input input-bordered w-full"
                    placeholder="Brief description for project cards"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Full Description</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="textarea textarea-bordered w-full"
                    rows={4}
                    placeholder="Detailed description of the project..."
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Project Image *</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full"
                  />
                  <p className="text-xs text-base-content/60 mt-2">
                    {editingProject ? 'Leave empty to keep current image, or upload a new one' : 'Select an image file (max 5MB)'}
                  </p>
                  
                  {/* Preview */}
                  {(previewUrl || (editingProject && editingProject.image_url && !selectedFile)) && (
                    <div className="mt-4">
                      <label className="label">
                        <span className="label-text">Preview</span>
                      </label>
                      <div className="relative w-full h-48 bg-base-200 rounded-lg overflow-hidden">
                        <img
                          src={previewUrl || editingProject.image_url}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Fallback: Manual URL input (optional) */}
                  <div className="mt-4">
                    <label className="label">
                      <span className="label-text text-xs">Or enter image URL manually (optional)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="input input-bordered w-full input-sm"
                      placeholder="https://example.com/project-image.jpg"
                      disabled={!!selectedFile}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Demo URL</span>
                    </label>
                    <input
                      type="url"
                      value={formData.demo_url}
                      onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                      className="input input-bordered w-full"
                      placeholder="https://demo.example.com"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Repository URL</span>
                    </label>
                    <input
                      type="url"
                      value={formData.repo_url}
                      onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                      className="input input-bordered w-full"
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Tech Stack</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                      className="input input-bordered flex-1"
                      placeholder="Add technology (e.g., React, Node.js)"
                    />
                    <button
                      type="button"
                      onClick={addTechStack}
                      className="btn btn-outline"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tech_stack.map((tech, index) => (
                      <span key={index} className="badge badge-primary gap-2">
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechStack(tech)}
                          className="btn btn-xs btn-circle btn-ghost"
                        >
                          ×
                        </button>
                      </span>
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
                        {editingProject ? 'Update' : 'Create'}
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

export default Portfolio;
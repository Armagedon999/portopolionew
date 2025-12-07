import { useState, useEffect } from 'react';
import { ExternalLink, Github, Eye, Code, Filter, X } from 'lucide-react';
import { db } from '../../lib/supabase';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('all');
  const { elementRef, hasIntersected } = useIntersectionObserver();

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, filter]);

  const loadProjects = async () => {
    try {
      const { data, error } = await db.getProjects();
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    if (filter === 'all') {
      setFilteredProjects(projects);
    } else if (filter === 'featured') {
      setFilteredProjects(projects.filter(project => project.is_featured));
    } else {
      // Filter by technology
      setFilteredProjects(projects.filter(project => 
        project.tech_stack?.some(tech => 
          tech.toLowerCase().includes(filter.toLowerCase())
        )
      ));
    }
  };

  const getTechFilters = () => {
    const allTech = projects.flatMap(project => project.tech_stack || []);
    const uniqueTech = [...new Set(allTech)];
    return uniqueTech.slice(0, 6); // Show top 6 technologies
  };

  const getTechColor = (tech) => {
    const colors = {
      'React': '#61DAFB',
      'JavaScript': '#F7DF1E',
      'TypeScript': '#3178C6',
      'Node.js': '#339933',
      'Python': '#3776AB',
      'PostgreSQL': '#336791',
      'MongoDB': '#47A248',
      'Express': '#000000',
      'Tailwind': '#06B6D4',
      'Next.js': '#000000',
    };
    return colors[tech] || '#6B7280';
  };

  if (loading) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section 
      id="portfolio" 
      ref={elementRef}
      className="py-20 bg-base-100 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          hasIntersected ? 'animate-fade-in' : 'opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-4">
            Featured Work
          </h2>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and experience
          </p>
        </div>

        {/* Filter Tabs */}
        <div className={`flex flex-wrap justify-center gap-2 mb-12 transition-all duration-1000 delay-200 ${
          hasIntersected ? 'animate-slide-up' : 'opacity-0 translate-y-8'
        }`}>
          <button
            onClick={() => setFilter('all')}
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            All Projects
          </button>
          <button
            onClick={() => setFilter('featured')}
            className={`btn btn-sm ${filter === 'featured' ? 'btn-primary' : 'btn-ghost'}`}
          >
            Featured
          </button>
          {getTechFilters().map((tech) => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              className={`btn btn-sm ${filter === tech ? 'btn-primary' : 'btn-ghost'}`}
            >
              {tech}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-base-content/50">No projects found for the selected filter.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={`group bg-base-100 rounded-2xl shadow-xl border border-base-300/20 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                  hasIntersected 
                    ? 'animate-scale-in' 
                    : 'opacity-0 scale-90'
                }`}
                style={{ transitionDelay: `${index * 100 + 300}ms` }}
              >
                {/* Project Image */}
                <div className="relative overflow-hidden h-48">
                  {project.image_url ? (
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Code className="w-16 h-16 text-primary/50" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="btn btn-circle btn-primary btn-sm"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-secondary btn-sm"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-accent btn-sm"
                        title="View Code"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Featured Badge */}
                  {project.is_featured && (
                    <div className="absolute top-4 right-4">
                      <span className="badge badge-primary badge-sm">Featured</span>
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-base-content/70 mb-4 line-clamp-2">
                    {project.short_description || project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack?.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${getTechColor(tech)}20`,
                          color: getTechColor(tech),
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack?.length > 4 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-base-300 text-base-content">
                        +{project.tech_stack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Action Links */}
                  <div className="flex space-x-2">
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm flex-1"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Demo
                      </a>
                    )}
                    
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm flex-1"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-base-100 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
              {/* Modal Header */}
              <div className="sticky top-0 bg-base-100 border-b border-base-300/20 p-6 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-base-content">
                  {selectedProject.title}
                </h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="btn btn-circle btn-ghost"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Project Image */}
                {selectedProject.image_url && (
                  <div className="mb-6">
                    <img 
                      src={selectedProject.image_url} 
                      alt={selectedProject.title}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                )}

                {/* Project Description */}
                <div className="mb-6">
                  <p className="text-base-content/80 text-lg leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tech_stack?.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: `${getTechColor(tech)}20`,
                          color: getTechColor(tech),
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {selectedProject.demo_url && (
                    <a
                      href={selectedProject.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-lg flex-1"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      View Live Demo
                    </a>
                  )}
                  
                  {selectedProject.repo_url && (
                    <a
                      href={selectedProject.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-lg flex-1"
                    >
                      <Github className="w-5 h-5 mr-2" />
                      View Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
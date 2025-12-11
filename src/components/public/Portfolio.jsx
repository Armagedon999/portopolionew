import { useState, useEffect } from 'react';
import { ExternalLink, Github, Eye, Code, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';
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
      className="section-padding bg-base-100 relative overflow-hidden"
    >
      {/* Premium Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full mesh-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full mesh-blob"></div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        <div className={`text-center mb-20 transition-all duration-1000 ${
          hasIntersected ? 'animate-fade-in' : 'opacity-0'
        }`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-heading gradient-text mb-6">
              Featured Work
            </h2>
            <p className="text-body-lg text-base-content/70 max-w-3xl mx-auto leading-relaxed">
              Here are some of my recent projects that showcase my skills and experience
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-6 rounded-full"></div>
          </motion.div>
        </div>

        {/* Featured Projects Showcase */}
        {projects.filter(p => p.is_featured).length > 0 && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-3xl font-bold gradient-text mb-3 flex items-center justify-center gap-2">
                  <span className="text-2xl">⭐</span>
                  Featured Projects
                </h3>
                <p className="text-base-content/70 text-lg">Showcasing my best work</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8 xl:gap-10 w-full">
              {projects.filter(p => p.is_featured).slice(0, 3).map((project, index) => (
                <motion.div
                  key={`featured-${project.id}`}
                  className="group glass-card rounded-3xl shadow-2xl overflow-hidden hover-lift border border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Project Image */}
                  <div className="relative overflow-hidden aspect-[4/3]">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          console.error('Error loading project image:', project.image_url);
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ${project.image_url ? 'hidden' : ''}`}
                    >
                      <Code className="w-16 h-16 text-primary/50" />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>

                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-lg">⭐ Featured</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        className="w-10 h-10 glass-card rounded-xl flex items-center justify-center hover:scale-110 transition-transform opacity-90 hover:opacity-100"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5 text-white" />
                      </button>

                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 glass-card rounded-xl flex items-center justify-center hover:scale-110 transition-transform opacity-90 hover:opacity-100"
                          title="Live Demo"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-5 h-5 text-white" />
                        </a>
                      )}

                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 glass-card rounded-xl flex items-center justify-center hover:scale-110 transition-transform opacity-90 hover:opacity-100"
                          title="View Code"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-5 h-5 text-white" />
                        </a>
                      )}
                    </div>

                    {/* Project Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h4 className="text-xl font-bold mb-2 line-clamp-1">
                        {project.title}
                      </h4>
                      <p className="text-white/90 text-sm mb-3 line-clamp-2">
                        {project.short_description || project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack?.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filter Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              filter === 'all'
                ? 'btn-gradient text-white shadow-lg'
                : 'glass-card hover-lift'
            }`}
          >
            <Filter className="w-4 h-4 mr-2 inline" />
            All Projects
          </button>
          <button
            onClick={() => setFilter('featured')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              filter === 'featured'
                ? 'btn-gradient text-white shadow-lg'
                : 'glass-card hover-lift'
            }`}
          >
            Featured
          </button>
          {getTechFilters().map((tech) => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filter === tech
                  ? 'btn-gradient text-white shadow-lg'
                  : 'glass-card hover-lift'
              }`}
            >
              {tech}
            </button>
          ))}
        </motion.div>

        {/* Projects Masonry Grid */}
        {filteredProjects.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-base-content/50">No projects found for the selected filter.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8 xl:gap-10 w-full">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="group glass-card rounded-3xl shadow-xl overflow-hidden hover-lift cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{
                  gridRow: index % 3 === 0 ? 'span 2' : 'span 1'
                }}
                onClick={() => setSelectedProject(project)}
              >
                {/* Project Image */}
                <div className="relative overflow-hidden" style={{ height: index % 3 === 0 ? '400px' : '250px' }}>
                  {project.image_url ? (
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        console.error('Error loading project image:', project.image_url);
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ${project.image_url ? 'hidden' : ''}`}
                  >
                    <Code className="w-16 h-16 text-primary/50" />
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedProject(project); }}
                      className="w-10 h-10 glass-card rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5 text-white" />
                    </button>
                    
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 glass-card rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                        title="Live Demo"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-5 h-5 text-white" />
                      </a>
                    )}
                    
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 glass-card rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                        title="View Code"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-5 h-5 text-white" />
                      </a>
                    )}
                  </div>

                  {/* Featured Badge */}
                  {project.is_featured && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary/90 text-white text-xs font-semibold rounded-full">Featured</span>
                    </div>
                  )}
                  
                  {/* Project Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">
                      {project.title}
                    </h3>
                    <p className="text-white/80 text-sm mb-3 line-clamp-2">
                      {project.short_description || project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack?.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack?.length > 3 && (
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-medium">
                          +{project.tech_stack.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}

        {/* Project Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="glass-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl dark:bg-base-200/95 dark:backdrop-blur-xl">
              {/* Modal Header */}
              <div className="sticky top-0 glass-card border-b border-base-300/20 p-6 flex justify-between items-center dark:border-base-100/10">
                <h3 className="text-2xl font-bold text-base-content">
                  {selectedProject.title}
                </h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="btn btn-circle btn-ghost hover:bg-base-200 dark:hover:bg-base-100/10"
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
                      className="w-full h-64 object-cover rounded-xl shadow-lg"
                      onError={(e) => {
                        console.error('Error loading project image:', selectedProject.image_url);
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Project Description */}
                <div className="mb-6">
                  <p className="text-base-content/80 text-lg leading-relaxed dark:text-base-content/90">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-base-content dark:text-base-content">Technologies Used</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tech_stack?.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm"
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
                      className="btn btn-primary btn-lg flex-1 shadow-lg hover:shadow-xl dark:shadow-primary/25"
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
                      className="btn btn-outline btn-lg flex-1 dark:border-base-100/30 dark:text-base-content dark:hover:bg-base-100/10"
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
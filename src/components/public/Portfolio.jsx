import { useState, useEffect } from 'react';
import { ExternalLink, Github, X, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/supabase';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const ProjectDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;

  if (!description) return null;

  const shouldTruncate = description.length > maxLength;

  return (
    <div>
      <p className="text-base-content/80 leading-relaxed text-lg whitespace-pre-wrap font-light">
        {shouldTruncate && !isExpanded
          ? `${description.substring(0, maxLength)}...`
          : description
        }
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-primary flex items-center gap-1 text-sm font-semibold hover:underline"
        >
          {isExpanded ? (
            <>Tampilkan lebih sedikit <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Tampilkan lebih banyak <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      )}
    </div>
  );
};

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
      <div className="py-20 flex justify-center items-center min-h-[400px]">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  // Helper to determine grid span
  const getGridClass = (index, total) => {
    // Standard grid for small total
    if (total < 4) return "co-span-1 row-span-1";

    const pattern = index % 10;

    if (pattern === 0 || pattern === 7) return "md:col-span-2 md:row-span-2"; // Big Square
    if (pattern === 3) return "md:col-span-2"; // Wide Rectangle
    return "col-span-1 row-span-1"; // Standard
  };

  return (
    <section
      id="portfolio"
      ref={elementRef}
      className="section-padding bg-base-100 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className={`mb-20 pt-10 transition-all duration-1000 ${hasIntersected ? 'animate-fade-in' : 'opacity-0'
          }`}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-16"
          >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-base-content max-w-4xl">
              LET THE WORK<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent opacity-80">
                SPEAK FOR ITSELF
              </span>.
            </h2>

            <div className="hidden md:block w-32 h-32 rounded-full border border-base-content/20 animate-spin-slow p-2 absolute top-10 right-10 opacity-20 pointer-events-none">
              <div className="w-full h-full rounded-full border border-dashed border-base-content/40"></div>
            </div>
          </motion.div>
        </div>

        {/* Minimal Filters */}
        <motion.div
          className="flex flex-wrap gap-x-8 gap-y-4 mb-16 items-center text-sm font-medium tracking-wide uppercase"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => setFilter('all')}
            className={`transition-colors duration-300 ${filter === 'all' ? 'text-primary border-b-2 border-primary' : 'text-base-content/40 hover:text-base-content'
              }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter('featured')}
            className={`transition-colors duration-300 ${filter === 'featured' ? 'text-primary border-b-2 border-primary' : 'text-base-content/40 hover:text-base-content'
              }`}
          >
            Featured
          </button>

          <span className="w-px h-4 bg-base-content/20 hidden sm:block"></span>

          {getTechFilters().map((tech) => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              className={`transition-colors duration-300 ${filter === tech ? 'text-primary border-b-2 border-primary' : 'text-base-content/40 hover:text-base-content'
                }`}
            >
              {tech}
            </button>
          ))}
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`relative group rounded-2xl overflow-hidden cursor-pointer bg-base-200 ${getGridClass(index, filteredProjects.length)}`}
                onClick={() => setSelectedProject(project)}
              >
                {/* Full Image */}
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-base-300 flex items-center justify-center">
                    <span className="text-6xl text-base-content/10 font-black">{project.title[0]}</span>
                  </div>
                )}

                {/* Hover Reveal Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-2 leading-tight">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack?.slice(0, 3).map((tech) => (
                        <span key={tech} className="text-xs text-white/70 font-mono tracking-wide">
                          #{tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <span className="text-white text-sm font-semibold border-b border-white pb-0.5 mt-2 flex items-center gap-2">
                        View Case Study <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <h3 className="text-xl">No projects found.</h3>
          </div>
        )}

        {/* Minimal Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-base-100/80 backdrop-blur-md"
              />

              <motion.div
                layoutId={`project-${selectedProject.id}`}
                className="w-full max-w-3xl bg-base-100 rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-base-content/5 flex flex-col max-h-[85vh]"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
              >

                {/* Header Actions */}
                <div className="absolute top-0 right-0 p-4 z-20 flex gap-2">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="btn btn-circle btn-sm bg-base-100/50 backdrop-blur-sm border-none hover:bg-base-200 text-base-content"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar">
                  {/* Image Header */}
                  <div className="w-full h-56 sm:h-72 shrink-0">
                    {selectedProject.image_url ? (
                      <img
                        src={selectedProject.image_url}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-base-200 flex items-center justify-center">
                        <ArrowUpRight className="w-16 h-16 text-base-content/20" />
                      </div>
                    )}
                  </div>

                  <div className="p-6 md:p-8 space-y-6">
                    {/* Title & Links */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <h2 className="text-3xl font-black tracking-tight leading-tight">{selectedProject.title}</h2>

                      <div className="flex gap-2 shrink-0">
                        {selectedProject.demo_url && (
                          <a
                            href={selectedProject.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm rounded-full px-4"
                          >
                            Live Demo <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                        {selectedProject.repo_url && (
                          <a
                            href={selectedProject.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-sm rounded-full px-4"
                          >
                            <Github className="w-4 h-4" /> Code
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech_stack?.map(tech => (
                        <span key={tech} className="px-2.5 py-1 bg-base-200 text-xs font-bold uppercase tracking-wider rounded-md text-base-content/70">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <div className="bg-base-200/30 rounded-2xl p-4 md:p-6">
                      <ProjectDescription description={selectedProject.description} />
                    </div>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Portfolio;
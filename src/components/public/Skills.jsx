import { useState, useEffect, useRef, memo, useMemo } from 'react';
import { Code, Palette, Server, Database, Cloud, PenTool as Tool, Sparkles } from 'lucide-react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { db } from '../../lib/supabase';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const { elementRef, hasIntersected } = useIntersectionObserver();

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
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return <Code className="w-6 h-6" />;
      case 'design':
        return <Palette className="w-6 h-6" />;
      case 'backend':
        return <Server className="w-6 h-6" />;
      case 'database':
        return <Database className="w-6 h-6" />;
      case 'cloud':
        return <Cloud className="w-6 h-6" />;
      default:
        return <Tool className="w-6 h-6" />;
    }
  };

  const groupedSkills = useMemo(() => {
    return skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});
  }, [skills]);

  // Skill Card Component untuk Marquee - Optimized with memo
  const SkillCard = memo(({ skill }) => {
    return (
      <motion.div
        className="relative group cursor-pointer flex-shrink-0"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative">
          {/* Main card - No shadow, reduced blur */}
          <div className="relative glass-card rounded-xl p-4 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-200 w-[140px] sm:w-[160px] shadow-none">
            {/* Animated background gradient */}
            <div 
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{ 
                background: `linear-gradient(135deg, ${skill.color || '#3B82F6'}, ${skill.color || '#8B5CF6'})` 
              }}
            />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="flex items-center justify-center mb-2">
                {skill.icon_url ? (
                  <div className="relative">
                    <img 
                      src={skill.icon_url} 
                      alt={skill.name}
                      className="w-10 h-10 object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : (
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-base relative overflow-hidden"
                    style={{ backgroundColor: skill.color || '#3B82F6' }}
                  >
                    <span className="relative z-10">{skill.name.charAt(0)}</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  </div>
                )}
              </div>

              {/* Skill name */}
              <h3 className="text-center font-semibold text-xs text-base-content group-hover:text-primary transition-colors">
                {skill.name}
              </h3>

              {/* Featured badge */}
              {skill.is_featured && (
                <div className="flex justify-center mt-1.5">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-semibold">
                    <Sparkles className="w-2 h-2" />
                    <span>Featured</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  });

  // Marquee Row Component - Infinite Scrolling - Optimized
  const MarqueeRow = memo(({ category, categorySkills, direction = 'left', speed = 20 }) => {
    // Duplicate skills untuk seamless loop (2 set untuk infinite scroll)
    const duplicatedSkills = useMemo(() => [...categorySkills, ...categorySkills], [categorySkills]);
    const containerRef = useRef(null);
    const x = useMotionValue(0);

    useEffect(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.scrollWidth / 2; // Width of one set

      // Set initial position
      x.set(direction === 'right' ? -containerWidth : 0);

      const controls = animate(
        x,
        direction === 'left' ? -containerWidth : 0,
        {
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }
      );

      return () => controls.stop();
    }, [direction, speed, x]);

    return (
      <div className="relative mb-8 overflow-hidden">
        {/* Category Header */}
        <div className="flex items-center gap-4 mb-6 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg flex items-center justify-center">
              {getCategoryIcon(category)}
            </div>
            <h3 className="text-xl font-bold text-base-content">{category}</h3>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          <span className="text-xs text-base-content/60 font-semibold">
            {categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'skills'}
          </span>
        </div>

        {/* Gradient overlays untuk fade effect */}
        <div className="absolute left-0 top-16 bottom-0 w-32 bg-gradient-to-r from-base-100 via-base-100/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-16 bottom-0 w-32 bg-gradient-to-l from-base-100 via-base-100/80 to-transparent z-10 pointer-events-none" />

        {/* Marquee Container */}
        <div className="overflow-hidden">
          <motion.div
            ref={containerRef}
            className="flex gap-2"
            style={{ x }}
          >
            {duplicatedSkills.map((skill, index) => (
              <SkillCard key={`${skill.id}-${index}`} skill={skill} />
            ))}
          </motion.div>
        </div>
      </div>
    );
  });

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
      id="skills" 
      ref={elementRef}
      className="section-padding bg-base-100 relative overflow-hidden"
    >
      {/* Simplified Background - Reduced animations for performance */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full mesh-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full mesh-blob" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-heading gradient-text mb-4">
            Skills & Technologies
          </h2>
          <p className="text-body-lg text-base-content/70 max-w-2xl mx-auto">
            A collection of tools and technologies I work with
          </p>
        </motion.div>

        {/* Skills by Category - Marquee Rows */}
        <div className="space-y-12">
          {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <MarqueeRow 
                category={category}
                categorySkills={categorySkills}
                direction={categoryIndex % 2 === 0 ? 'left' : 'right'}
                speed={15 + (categoryIndex % 3) * 5}
              />
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        {skills.length > 0 && (
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="stats stats-vertical lg:stats-horizontal glass-card">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <Code className="w-8 h-8" />
                </div>
                <div className="stat-title">Technologies</div>
                <div className="stat-value text-primary">{skills.length}</div>
                <div className="stat-desc">Tools & frameworks</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <Server className="w-8 h-8" />
                </div>
                <div className="stat-title">Categories</div>
                <div className="stat-value text-secondary">{Object.keys(groupedSkills).length}</div>
                <div className="stat-desc">Skill domains</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-accent">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="stat-title">Featured</div>
                <div className="stat-value text-accent">
                  {skills.filter(s => s.is_featured).length}
                </div>
                <div className="stat-desc">Top skills</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Skills;
import { useState, useEffect } from 'react';
import { Code, Palette, Server, Database, Cloud, PenTool as Tool } from 'lucide-react';
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

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

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
      className="py-20 bg-base-200/50 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-l from-secondary/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          hasIntersected ? 'animate-fade-in' : 'opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-4">
            Skills & Technologies
          </h2>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Here are the technologies and tools I work with to bring ideas to life
          </p>
        </div>

        <div className="space-y-12">
          {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
            <div 
              key={category}
              className={`transition-all duration-1000 ${
                hasIntersected 
                  ? 'animate-slide-up' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${categoryIndex * 200 + 200}ms` }}
            >
              {/* Category Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  {getCategoryIcon(category)}
                </div>
                <h3 className="text-2xl font-bold text-base-content">{category}</h3>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorySkills.map((skill, skillIndex) => (
                  <div
                    key={skill.id}
                    className={`bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20 hover:shadow-xl hover:scale-105 transition-all duration-300 group ${
                      hasIntersected 
                        ? 'animate-scale-in' 
                        : 'opacity-0 scale-90'
                    }`}
                    style={{ 
                      transitionDelay: `${categoryIndex * 200 + skillIndex * 100 + 300}ms` 
                    }}
                  >
                    {/* Skill Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      {skill.icon_url ? (
                        <img 
                          src={skill.icon_url} 
                          alt={skill.name}
                          className="w-10 h-10"
                        />
                      ) : (
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: skill.color || '#3B82F6' }}
                        >
                          {skill.name.charAt(0)}
                        </div>
                      )}
                      <h4 className="font-bold text-lg text-base-content group-hover:text-primary transition-colors">
                        {skill.name}
                      </h4>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-base-content/70">Proficiency</span>
                        <span className="font-semibold text-primary">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-base-300 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            backgroundColor: skill.color || '#3B82F6',
                            width: hasIntersected ? `${skill.level}%` : '0%',
                            transitionDelay: `${categoryIndex * 200 + skillIndex * 100 + 500}ms`
                          }}
                        />
                      </div>
                    </div>

                    {/* Skill Badge */}
                    {skill.is_featured && (
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Skills Summary */}
        {skills.length > 0 && (
          <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${
            hasIntersected ? 'animate-fade-in' : 'opacity-0'
          }`}>
            <div className="stats stats-vertical lg:stats-horizontal shadow-xl bg-base-100 border border-base-300/20">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <Code className="w-8 h-8" />
                </div>
                <div className="stat-title">Technologies</div>
                <div className="stat-value text-primary">{skills.length}</div>
                <div className="stat-desc">Different tools mastered</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <Server className="w-8 h-8" />
                </div>
                <div className="stat-title">Categories</div>
                <div className="stat-value text-secondary">{Object.keys(groupedSkills).length}</div>
                <div className="stat-desc">Skill categories</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-accent">
                  <Tool className="w-8 h-8" />
                </div>
                <div className="stat-title">Average Level</div>
                <div className="stat-value text-accent">
                  {Math.round(skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length)}%
                </div>
                <div className="stat-desc">Skill proficiency</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
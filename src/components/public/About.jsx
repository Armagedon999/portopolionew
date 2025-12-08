import { useState, useEffect } from 'react';
import { User, MapPin, Award, Mail, Phone, Briefcase, Code2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../../lib/supabase';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const About = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { elementRef, hasIntersected } = useIntersectionObserver();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data, error } = await db.getProfile();
      if (error) {
        console.error('Error loading profile:', error);
        setProfile({
          full_name: 'Full Stack Developer',
          title: 'Web Developer',
          bio: 'Passionate developer with expertise in modern web technologies.',
          location: 'Your Location',
          email: 'your.email@example.com'
        });
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile({
        full_name: 'Full Stack Developer',
        title: 'Web Developer',
        bio: 'Passionate developer with expertise in modern web technologies.',
        location: 'Your Location',
        email: 'your.email@example.com'
      });
    } finally {
      setLoading(false);
    }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section 
      id="about" 
      ref={elementRef}
      className="section-padding bg-base-200/30 relative overflow-hidden"
    >
      {/* Premium Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full mesh-blob"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full mesh-blob"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-heading gradient-text mb-4">
            About Me
          </h2>
          <p className="text-body-lg text-base-content/70 max-w-2xl mx-auto">
            Crafting digital experiences with passion and precision
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Large Bio Card - Spans 2 columns */}
          <motion.div
            className="lg:col-span-2 glass-card rounded-3xl p-8"
            variants={itemVariants}
          >
            <div className="flex items-start gap-4 mb-6">
              <User className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-2xl font-bold text-base-content mb-2">
                  {profile?.full_name || 'Full Stack Developer'}
                </h3>
                <p className="text-base-content/70 font-medium">
                  {profile?.title || 'Web Developer'}
                </p>
              </div>
            </div>
            <p className="text-base-content/80 leading-relaxed text-lg">
              {profile?.bio || profile?.hero_description || 'Passionate developer with expertise in modern web technologies, creating innovative solutions that make a difference.'}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button 
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-gradient btn-md shadow-lg hover:shadow-xl"
              >
                Get In Touch
              </button>
              
              {profile?.resume_url && (
                <a 
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-md"
                >
                  Download CV
                </a>
              )}
            </div>
          </motion.div>

          {/* Image Card */}
          <motion.div
            className="glass-card rounded-3xl overflow-hidden aspect-square"
            variants={itemVariants}
          >
            {(() => {
              const imageUrl = profile?.about_image?.url || profile?.avatar_url;
              const imageAlt = profile?.about_image?.alt_text || profile?.full_name || 'Profile Image';
              
              if (imageUrl) {
                return (
                  <div className="relative w-full h-full">
                    <img 
                      src={imageUrl} 
                      alt={imageAlt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="glass-card rounded-xl p-3 dark:bg-base-100/20 dark:backdrop-blur-lg">
                        <div className="text-white font-semibold dark:text-base-content">Professional Developer</div>
                        <div className="text-white/80 text-sm dark:text-base-content/80">5+ Years Experience</div>
                      </div>
                    </div>
                  </div>
                );
              }
              
              return (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <User className="w-32 h-32 text-primary/50" />
                </div>
              );
            })()}
          </motion.div>

          {/* Location Card */}
          {profile?.location && (
            <motion.div
              className="glass-card rounded-3xl p-6 flex flex-col justify-between"
              variants={itemVariants}
            >
              <MapPin className="w-6 h-6 text-primary mb-4" />
              <div>
                <div className="text-sm text-base-content/60 mb-1">Based in</div>
                <div className="text-xl font-bold text-base-content">{profile.location}</div>
              </div>
            </motion.div>
          )}

          {/* Title Card */}
          <motion.div
            className="glass-card rounded-3xl p-6 flex flex-col justify-between"
            variants={itemVariants}
          >
            <Award className="w-6 h-6 text-secondary mb-4" />
            <div>
              <div className="text-sm text-base-content/60 mb-1">Role</div>
              <div className="text-xl font-bold text-base-content">
                {profile?.title || 'Full Stack Developer'}
              </div>
            </div>
          </motion.div>

          {/* Email Card */}
          {profile?.email && (
            <motion.div
              className="glass-card rounded-3xl p-6 flex flex-col justify-between"
              variants={itemVariants}
            >
              <Mail className="w-6 h-6 text-accent mb-4" />
              <div>
                <div className="text-sm text-base-content/60 mb-1">Email</div>
                <a 
                  href={`mailto:${profile.email}`}
                  className="text-lg font-semibold text-base-content hover:text-primary transition-colors break-all"
                >
                  {profile.email}
                </a>
              </div>
            </motion.div>
          )}

          {/* Experience Highlight Card - Spans 2 columns */}
          <motion.div
            className="lg:col-span-2 glass-card rounded-3xl p-8"
            variants={itemVariants}
          >
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <Code2 className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold gradient-text mb-1">50+</div>
                <div className="text-sm text-base-content/60">Projects Completed</div>
              </div>
              <div className="text-center">
                <Briefcase className="w-8 h-8 text-secondary mx-auto mb-3" />
                <div className="text-3xl font-bold gradient-text mb-1">30+</div>
                <div className="text-sm text-base-content/60">Happy Clients</div>
              </div>
              <div className="text-center">
                <Zap className="w-8 h-8 text-accent mx-auto mb-3" />
                <div className="text-3xl font-bold gradient-text mb-1">5+</div>
                <div className="text-sm text-base-content/60">Years Experience</div>
              </div>
            </div>
          </motion.div>

          {/* Phone Card */}
          {profile?.phone && (
            <motion.div
              className="glass-card rounded-3xl p-6 flex flex-col justify-between"
              variants={itemVariants}
            >
              <Phone className="w-6 h-6 text-success mb-4" />
              <div>
                <div className="text-sm text-base-content/60 mb-1">Phone</div>
                <a 
                  href={`tel:${profile.phone}`}
                  className="text-lg font-semibold text-base-content hover:text-primary transition-colors"
                >
                  {profile.phone}
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
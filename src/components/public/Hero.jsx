import { useState, useEffect } from 'react';
import { ChevronDown, Download, Github, Linkedin, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../../lib/supabase';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const Hero = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { elementRef, hasIntersected } = useIntersectionObserver();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await db.getProfile();
      if (error) {
        console.error('Error loading profile:', error);
        // Set default profile to prevent errors
        setProfile({
          hero_title: "Hi, I'm a Developer",
          title: 'Full Stack Web Developer',
          bio: 'I create amazing digital experiences with modern technologies.'
        });
        return;
      }
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      // Set default profile to prevent errors
      setProfile({
        hero_title: "Hi, I'm a Developer",
        title: 'Full Stack Web Developer',
        bio: 'I create amazing digital experiences with modern technologies.'
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <section 
      id="home" 
      ref={elementRef}
      className="min-h-screen relative overflow-hidden bg-base-100"
    >
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <motion.div 
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full mesh-blob"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full mesh-blob"
          animate={{ 
            x: [0, -30, 0],
            y: [0, -50, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 relative z-10">
        <div className="grid xl:grid-cols-2 gap-16 xl:gap-20 2xl:gap-24 items-center min-h-screen py-20 xl:py-32">
          {/* Right Image - Large Rectangle */}
          <motion.div
            className="relative order-1 xl:order-2 xl:ml-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-2xl"
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-6 -right-6 w-40 h-40 bg-secondary/20 rounded-2xl"
                animate={{ rotate: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity }}
              />

              {/* Main Image Container */}
<<<<<<< HEAD
              <div className="relative glass-card rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-w-sm mx-auto">
=======
 <div className="relative glass-card rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] w-full max-w-md xl:max-w-lg 2xl:max-w-xl mx-auto">
>>>>>>> 6c736b0 (Aj)
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10"></div>

                {(profile?.hero_image?.url || profile?.avatar_url) ? (
<<<<<<< HEAD
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={profile.hero_image?.url || profile.avatar_url}
                      alt={profile.hero_image?.alt_text || profile.full_name || 'Profile Image'}
                      className="w-full h-full object-cover"
                      style={{ 
                        objectPosition: '60% center',
                        transform: 'scale(1.05)'
                      }}
                      onError={(e) => {
                        console.error('Error loading hero image:', profile.hero_image?.url || profile.avatar_url);
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
=======
                  <img
                    src={profile.hero_image?.url || profile.avatar_url}
                    alt={profile.hero_image?.alt_text || profile.full_name || 'Profile Image'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Error loading hero image:', profile.hero_image?.url || profile.avatar_url);
                      e.target.style.display = 'none';
                    }}
                  />
>>>>>>> 6c736b0 (Aj)
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-8xl font-bold mb-4">
                        {profile?.full_name?.charAt(0) || 'D'}
                      </div>
                      <div className="text-2xl font-semibold">
                        {profile?.full_name || 'Developer'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating Badge */}
                <motion.div
                  className="absolute bottom-6 left-6 right-6 glass-card rounded-2xl p-4 z-20 dark:bg-base-100/20 dark:backdrop-blur-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-black/80 dark:text-base-content/80">Currently working on</div>
                      <div className="font-semibold text-black dark:text-base-content">Innovative Projects</div>
                    </div>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse dark:bg-green-500"></div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Left Content */}
          <motion.div
            className="space-y-8 order-2 xl:order-1 xl:mt-12"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                className="text-display gradient-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {profile?.hero_title || "Hi, I'm a Developer"}
              </motion.h1>

              <motion.h2
                className="text-heading text-base-content/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {profile?.hero_subtitle || profile?.title || 'Full Stack Web Developer'}
              </motion.h2>

              {/* Badge - Moved closer to subtitle */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-base-content/80">Available for new projects</span>
              </motion.div>

              <motion.p
                className="text-body-lg text-base-content/70 max-w-2xl xl:max-w-3xl leading-relaxed hidden sm:block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {profile?.hero_description || profile?.bio || 'I create amazing digital experiences with modern technologies.'}
              </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {profile?.resume_url ? (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="CV_Resume.pdf"
                  className="btn btn-gradient btn-lg group shadow-xl hover:shadow-2xl"
                >
                  <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Download CV
                </a>
              ) : (
                <button
                  onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn btn-gradient btn-lg group shadow-xl hover:shadow-2xl"
                >
                  <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Download CV
                </button>
              )}
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 glass-card rounded-xl flex items-center justify-center hover-lift group"
                >
                  <Github className="w-5 h-5 group-hover:scale-110 transition-transform text-base-content" />
                </a>
              )}

              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 glass-card rounded-xl flex items-center justify-center hover-lift group"
                >
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform text-base-content" />
                </a>
              )}

              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="w-12 h-12 glass-card rounded-xl flex items-center justify-center hover-lift group"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform text-base-content" />
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button 
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.7 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-base-content/60">Scroll Down</span>
          <ChevronDown className="w-6 h-6 text-base-content/60" />
        </div>
      </motion.button>
    </section>
  );
};

export default Hero;
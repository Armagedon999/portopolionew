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
      className="min-h-screen sm:min-h-screen relative overflow-hidden bg-base-100"
    >
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <motion.div 
          className="absolute top-0 right-0 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-primary/10 rounded-full mesh-blob"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[300px] sm:w-[450px] lg:w-[600px] h-[300px] sm:h-[450px] lg:h-[600px] bg-secondary/10 rounded-full mesh-blob"
          animate={{ 
            x: [0, -30, 0],
            y: [0, -50, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 relative z-10">
        <div className="flex flex-col xl:grid xl:grid-cols-2 xl:gap-20 2xl:gap-24 items-center min-h-screen py-8 sm:py-12 xl:py-20 pt-20 sm:pt-24 md:pt-28 xl:pt-20">
          {/* Right Image - Large Rectangle */}
          <motion.div
            className="relative order-1 xl:order-2 xl:ml-4 mt-0 sm:mt-4 md:mt-6 xl:mt-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* Decorative Elements - Hidden on mobile */}
              <motion.div
                className="hidden sm:block absolute -top-6 -left-6 w-24 sm:w-32 h-24 sm:h-32 bg-primary/20 rounded-2xl"
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.div
                className="hidden sm:block absolute -bottom-6 -right-6 w-32 sm:w-40 h-32 sm:h-40 bg-secondary/20 rounded-2xl"
                animate={{ rotate: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity }}
              />

              {/* Main Image Container */}
              <div className="relative glass-card rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] w-full max-w-[280px] sm:max-w-sm md:max-w-md xl:max-w-lg 2xl:max-w-xl mx-auto">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10"></div>

                {(profile?.hero_image?.url || profile?.avatar_url) ? (
                  <img
                    src={profile.hero_image?.url || profile.avatar_url}
                    alt={profile.hero_image?.alt_text || profile.full_name || 'Profile Image'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Error loading hero image:', profile.hero_image?.url || profile.avatar_url);
                      e.target.style.display = 'none';
                    }}
                  />
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

                {/* Floating Badge - Smaller on mobile */}
                <motion.div
                  className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 md:bottom-6 md:left-6 md:right-6 glass-card rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 z-20 dark:bg-base-100/20 dark:backdrop-blur-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-black/80 dark:text-white/80">Currently working on</div>
                      <div className="text-xs sm:text-sm md:text-base font-semibold text-black dark:text-white">Innovative Projects</div>
                    </div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse dark:bg-green-500"></div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Left Content */}
          <motion.div
            className="space-y-3 sm:space-y-4 md:space-y-6 xl:space-y-8 order-2 xl:order-1 xl:mt-12 w-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Main Heading */}
            <div className="space-y-2 sm:space-y-3 xl:space-y-4">
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold gradient-text leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {profile?.hero_title || "Hi, I'm a Developer"}
              </motion.h1>

              <motion.h2
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-base-content/90 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {profile?.hero_subtitle || profile?.title || 'Full Stack Web Developer'}
              </motion.h2>

              {/* Badge - Moved closer to subtitle */}
              <motion.div
                className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 glass-card rounded-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-base-content/80">Available for new projects</span>
              </motion.div>

              <motion.p
                className="text-sm sm:text-base md:text-lg text-base-content/70 max-w-2xl xl:max-w-3xl leading-relaxed hidden sm:block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {profile?.hero_description || profile?.bio || 'I create amazing digital experiences with modern technologies.'}
              </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-wrap gap-2 sm:gap-3 md:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <button
                onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-gradient btn-sm sm:btn-md md:btn-lg group shadow-xl hover:shadow-2xl text-xs sm:text-sm md:text-base"
              >
                View My Work
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {profile?.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm sm:btn-md md:btn-lg glass-card hover:glass-card text-xs sm:text-sm md:text-base"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Download Resume</span>
                  <span className="sm:hidden">Resume</span>
                </a>
              )}
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex gap-2 sm:gap-3 md:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 glass-card rounded-xl flex items-center justify-center hover-lift group"
                >
                  <Github className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-base-content" />
                </a>
              )}

              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 glass-card rounded-xl flex items-center justify-center hover-lift group"
                >
                  <Linkedin className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-base-content" />
                </a>
              )}

              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 glass-card rounded-xl flex items-center justify-center hover-lift group"
                >
                  <Mail className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-base-content" />
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Centered on Mobile */}
      <motion.button 
        onClick={scrollToAbout}
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 cursor-pointer z-20 mx-auto w-fit"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.7 }}
      >
        <div className="flex flex-col items-center gap-1 sm:gap-2">
          <span className="text-[10px] sm:text-xs md:text-sm text-base-content/60">Scroll Down</span>
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-base-content/60" />
        </div>
      </motion.button>
    </section>
  );
};

export default Hero;
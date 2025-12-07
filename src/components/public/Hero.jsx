import { useState, useEffect } from 'react';
import { ChevronDown, Download, Github, Linkedin, Mail } from 'lucide-react';
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
      const { data, error } = await db.getProfile();
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
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
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-accent/30 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${
          hasIntersected ? 'animate-fade-in' : 'opacity-0'
        }`}>
          {/* Profile Image */}
          <div className={`mb-8 transition-all duration-1000 delay-200 ${
            hasIntersected ? 'animate-scale-in' : 'opacity-0 scale-90'
          }`}>
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-primary/20 shadow-2xl">
              {profile?.hero_image?.url || profile?.avatar_url ? (
                <img 
                  src={profile.hero_image?.url || profile.avatar_url} 
                  alt={profile.hero_image?.alt_text || profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {profile?.full_name?.charAt(0) || 'D'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Hero Content */}
          <div className={`space-y-6 transition-all duration-1000 delay-300 ${
            hasIntersected ? 'animate-slide-up' : 'opacity-0 translate-y-8'
          }`}>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {profile?.hero_title || 'Hi, I\'m a Developer'}
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-base-content/80">
              {profile?.hero_subtitle || profile?.title || 'Full Stack Web Developer'}
            </h2>
            
            <p className="text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
              {profile?.hero_description || profile?.bio || 'I create amazing digital experiences with modern technologies.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mt-10 transition-all duration-1000 delay-500 ${
            hasIntersected ? 'animate-slide-up' : 'opacity-0 translate-y-8'
          }`}>
            <button 
              onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-primary btn-lg group"
            >
              View My Work
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
            
            {profile?.resume_url && (
              <a 
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg"
              >
                <Download className="w-5 h-5" />
                Download Resume
              </a>
            )}
          </div>

          {/* Social Links */}
          <div className={`flex justify-center gap-6 mt-10 transition-all duration-1000 delay-700 ${
            hasIntersected ? 'animate-slide-up' : 'opacity-0 translate-y-8'
          }`}>
            {profile?.github_url && (
              <a 
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-ghost btn-lg hover:btn-primary group"
              >
                <Github className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
            )}
            
            {profile?.linkedin_url && (
              <a 
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-ghost btn-lg hover:btn-primary group"
              >
                <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
            )}
            
            {profile?.email && (
              <a 
                href={`mailto:${profile.email}`}
                className="btn btn-circle btn-ghost btn-lg hover:btn-primary group"
              >
                <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToAbout}
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer transition-all duration-1000 delay-1000 ${
          hasIntersected ? 'opacity-70 hover:opacity-100' : 'opacity-0'
        }`}
      >
        <ChevronDown className="w-8 h-8 text-base-content" />
      </button>
    </section>
  );
};

export default Hero;
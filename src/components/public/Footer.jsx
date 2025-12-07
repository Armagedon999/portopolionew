import { useState, useEffect } from 'react';
import { Heart, Code2, Github, Linkedin, Twitter, Mail, ArrowUp } from 'lucide-react';
import { db } from '../../lib/supabase';

const Footer = () => {
  const [profile, setProfile] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    loadProfile();
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadProfile = async () => {
    try {
      const { data, error } = await db.getProfile();
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-300/50 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full mesh-blob"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full mesh-blob"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-2 text-3xl font-bold gradient-text">
              <Code2 className="w-10 h-10 text-primary" />
              <span>DevPortfolio</span>
            </div>
            <p className="text-base-content/70 leading-relaxed text-lg max-w-md">
              {profile?.bio || 'Passionate web developer creating amazing digital experiences with modern technologies.'}
            </p>
            <div className="flex space-x-3">
              {profile?.github_url && (
                <a 
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 glass-card rounded-xl flex items-center justify-center hover-lift group"
                >
                  <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {profile?.linkedin_url && (
                <a 
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 glass-card rounded-xl flex items-center justify-center hover-lift group"
                >
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {profile?.twitter_url && (
                <a 
                  href={profile.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 glass-card rounded-xl flex items-center justify-center hover-lift group"
                >
                  <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {profile?.email && (
                <a 
                  href={`mailto:${profile.email}`}
                  className="w-12 h-12 glass-card rounded-xl flex items-center justify-center hover-lift group"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-base-content">Navigation</h3>
            <div className="space-y-3">
              {[
                { name: 'Home', href: '#home' },
                { name: 'About', href: '#about' },
                { name: 'Skills', href: '#skills' },
                { name: 'Portfolio', href: '#portfolio' },
                { name: 'Contact', href: '#contact' },
              ].map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="block text-base-content/70 hover:text-primary transition-colors text-lg hover:translate-x-2 transition-transform"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-base-content">Contact</h3>
            <div className="space-y-4 text-base-content/70">
              {profile?.email && (
                <div>
                  <div className="text-sm text-base-content/50 mb-1">Email</div>
                  <a 
                    href={`mailto:${profile.email}`}
                    className="hover:text-primary transition-colors text-base break-all"
                  >
                    {profile.email}
                  </a>
                </div>
              )}
              {profile?.phone && (
                <div>
                  <div className="text-sm text-base-content/50 mb-1">Phone</div>
                  <a 
                    href={`tel:${profile.phone}`}
                    className="hover:text-primary transition-colors text-base"
                  >
                    {profile.phone}
                  </a>
                </div>
              )}
              {profile?.location && (
                <div>
                  <div className="text-sm text-base-content/50 mb-1">Location</div>
                  <div className="text-base">{profile.location}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-base-content/20 to-transparent my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-base-content/70">
            <span>© {currentYear} {profile?.full_name || 'DevPortfolio'}.</span>
            <span className="hidden md:inline">Made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="hidden md:inline">using React & Tailwind CSS</span>
          </div>

          <div className="text-sm text-base-content/50">
            Designed & Built with passion
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 btn btn-gradient btn-circle shadow-2xl z-40 animate-bounce-in hover:scale-110 transition-transform"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
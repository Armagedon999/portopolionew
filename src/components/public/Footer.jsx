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
    <footer className="bg-base-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-2xl font-bold text-primary">
              <Code2 className="w-8 h-8" />
              <span>DevPortfolio</span>
            </div>
            <p className="text-base-content/70 leading-relaxed">
              {profile?.bio || 'Passionate web developer creating amazing digital experiences with modern technologies.'}
            </p>
            <div className="flex space-x-4">
              {profile?.github_url && (
                <a 
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-circle btn-ghost btn-sm hover:btn-primary group"
                >
                  <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {profile?.linkedin_url && (
                <a 
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-circle btn-ghost btn-sm hover:btn-secondary group"
                >
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {profile?.twitter_url && (
                <a 
                  href={profile.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-circle btn-ghost btn-sm hover:btn-accent group"
                >
                  <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {profile?.email && (
                <a 
                  href={`mailto:${profile.email}`}
                  className="btn btn-circle btn-ghost btn-sm hover:btn-primary group"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-base-content">Quick Links</h3>
            <div className="space-y-2">
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
                  className="block text-base-content/70 hover:text-primary transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-base-content">Get In Touch</h3>
            <div className="space-y-2 text-base-content/70">
              {profile?.email && (
                <div>
                  <strong>Email:</strong>
                  <br />
                  <a 
                    href={`mailto:${profile.email}`}
                    className="hover:text-primary transition-colors"
                  >
                    {profile.email}
                  </a>
                </div>
              )}
              {profile?.phone && (
                <div>
                  <strong>Phone:</strong>
                  <br />
                  <a 
                    href={`tel:${profile.phone}`}
                    className="hover:text-primary transition-colors"
                  >
                    {profile.phone}
                  </a>
                </div>
              )}
              {profile?.location && (
                <div>
                  <strong>Location:</strong>
                  <br />
                  {profile.location}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-base-content/70">
            <span>© {currentYear} {profile?.full_name || 'DevPortfolio'}. Made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>using React & Tailwind CSS</span>
          </div>

          <div className="text-sm text-base-content/50">
            Built with modern web technologies
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 btn btn-primary btn-circle shadow-lg z-40 animate-bounce-in"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
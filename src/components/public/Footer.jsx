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
    <footer className="bg-gradient-to-br from-base-300/80 via-base-200/60 to-base-300/80 relative overflow-hidden border-t border-base-content/10">
      {/* Enhanced Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/8 to-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tl from-secondary/8 to-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/3 via-transparent to-secondary/3 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Section - Enhanced */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-4xl font-bold gradient-text">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl backdrop-blur-sm">
                  <Code2 className="w-12 h-12 text-primary" />
                </div>
                <span>DevPortfolio</span>
              </div>
              <p className="text-base-content/80 leading-relaxed text-lg max-w-lg">
                {profile?.bio || 'Passionate web developer creating amazing digital experiences with modern technologies and innovative solutions.'}
              </p>
            </div>

            {/* Enhanced Social Links */}
            <div className="flex flex-wrap gap-4">
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-4 bg-gradient-to-br from-base-100/80 to-base-200/60 backdrop-blur-sm rounded-2xl border border-base-content/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover-lift"
                >
                  <Github className="w-6 h-6 text-base-content/70 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              )}
              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-4 bg-gradient-to-br from-base-100/80 to-base-200/60 backdrop-blur-sm rounded-2xl border border-base-content/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover-lift"
                >
                  <Linkedin className="w-6 h-6 text-base-content/70 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              )}
              {profile?.twitter_url && (
                <a
                  href={profile.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-4 bg-gradient-to-br from-base-100/80 to-base-200/60 backdrop-blur-sm rounded-2xl border border-base-content/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover-lift"
                >
                  <Twitter className="w-6 h-6 text-base-content/70 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="group relative p-4 bg-gradient-to-br from-base-100/80 to-base-200/60 backdrop-blur-sm rounded-2xl border border-base-content/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover-lift"
                >
                  <Mail className="w-6 h-6 text-base-content/70 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links - Enhanced */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-base-content bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Navigation</h3>
              <div className="space-y-4">
                {[
                  { name: 'Home', href: '#home' },
                  { name: 'About', href: '#about' },
                  { name: 'Skills', href: '#skills' },
                  { name: 'Portfolio', href: '#portfolio' },
                  { name: 'Contact', href: '#contact' },
                ].map((link, index) => (
                  <button
                    key={link.name}
                    onClick={() => {
                      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group flex items-center space-x-3 text-base-content/70 hover:text-primary transition-all duration-300 text-lg w-full text-left hover:translate-x-3"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-2 h-2 bg-primary/50 rounded-full group-hover:bg-primary group-hover:scale-125 transition-all duration-300"></div>
                    <span className="group-hover:font-medium">{link.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Info - Enhanced */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-base-content bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Get In Touch</h3>
              <div className="space-y-6">
                {profile?.email && (
                  <div className="group p-4 bg-gradient-to-br from-base-100/60 to-base-200/40 backdrop-blur-sm rounded-xl border border-base-content/10 hover:border-primary/20 transition-all duration-300">
                    <div className="text-sm text-base-content/50 mb-2 font-medium">Email</div>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-base-content hover:text-primary transition-colors font-medium break-all"
                    >
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile?.phone && (
                  <div className="group p-4 bg-gradient-to-br from-base-100/60 to-base-200/40 backdrop-blur-sm rounded-xl border border-base-content/10 hover:border-primary/20 transition-all duration-300">
                    <div className="text-sm text-base-content/50 mb-2 font-medium">Phone</div>
                    <a
                      href={`tel:${profile.phone}`}
                      className="text-base-content hover:text-primary transition-colors font-medium"
                    >
                      {profile.phone}
                    </a>
                  </div>
                )}
                {profile?.location && (
                  <div className="group p-4 bg-gradient-to-br from-base-100/60 to-base-200/40 backdrop-blur-sm rounded-xl border border-base-content/10 hover:border-primary/20 transition-all duration-300">
                    <div className="text-sm text-base-content/50 mb-2 font-medium">Location</div>
                    <div className="text-base-content font-medium">{profile.location}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Divider */}
        <div className="relative my-12">
          <div className="h-px bg-gradient-to-r from-transparent via-base-content/20 to-transparent"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-primary/50 to-secondary/50"></div>
        </div>

        {/* Bottom Footer - Enhanced */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-base-content/70">
            <div className="flex items-center gap-2">
              <span className="font-medium">© {currentYear} {profile?.full_name || 'DevPortfolio'}.</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>using React & Tailwind CSS</span>
            </div>
          </div>

          <div className="text-sm text-base-content/60 font-medium bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-full backdrop-blur-sm border border-base-content/10">
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
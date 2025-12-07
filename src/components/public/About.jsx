import { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Award } from 'lucide-react';
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
        // Set default profile data if error occurs
        setProfile({
          full_name: 'Full Stack Developer',
          title: 'Web Developer',
          bio: 'Passionate developer with expertise in modern web technologies.',
          location: 'Your Location',
          email: 'your.email@example.com'
        });
      } else {
        console.log('Profile data loaded:', data);
        console.log('About image data:', data?.about_image);
        console.log('Hero image data:', data?.hero_image);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Set default profile data if error occurs
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

  return (
    <section 
      id="about" 
      ref={elementRef}
      className="py-20 bg-base-100 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          hasIntersected ? 'animate-fade-in' : 'opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            About Me
          </h2>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Get to know more about me, my background, and what drives my passion for development
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image & Stats */}
          <div className={`relative transition-all duration-1000 delay-200 ${
            hasIntersected ? 'animate-slide-up' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative">
              {/* Main Image */}
              <div className="w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl">
                {(() => {
                  // Priority: about_image from images table > avatar_url from profiles table
                  const imageUrl = profile?.about_image?.url || profile?.avatar_url;
                  const imageAlt = profile?.about_image?.alt_text || profile?.full_name || 'Profile Image';
                  
                  if (imageUrl) {
                    return (
                      <img 
                        src={imageUrl} 
                        alt={imageAlt}
                        className="w-full h-96 object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    );
                  }
                  
                  return (
                    <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <User className="w-32 h-32 text-primary/50" />
                    </div>
                  );
                })()}
                
                {/* Hidden fallback div */}
                <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center" style={{display: 'none'}}>
                  <User className="w-32 h-32 text-primary/50" />
                </div>
                
                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -right-6 bg-base-100 rounded-xl shadow-2xl p-6 border-2 border-primary/20">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">5+</div>
                    <div className="text-sm text-base-content/70">Years Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Content */}
          <div className={`space-y-6 transition-all duration-1000 delay-400 ${
            hasIntersected ? 'animate-slide-up' : 'opacity-0 translate-y-8'
          }`}>
            <div>
              <h3 className="text-3xl font-bold text-base-content mb-4">
                {profile?.full_name || profile?.hero_title || 'Full Stack Developer'}
              </h3>
              <p className="text-lg text-base-content/80 leading-relaxed mb-6">
                {profile?.bio || profile?.hero_description || 'Passionate developer with expertise in modern web technologies, creating innovative solutions that make a difference.'}
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {profile?.location && (
                <div className="flex items-center space-x-3 p-4 bg-base-200/50 rounded-xl">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-base-content">Location</div>
                    <div className="text-sm text-base-content/70">{profile.location}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 p-4 bg-base-200/50 rounded-xl">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="font-semibold text-base-content">Title</div>
                  <div className="text-sm text-base-content/70">{profile?.title || profile?.hero_subtitle || 'Full Stack Developer'}</div>
                </div>
              </div>

              {profile?.email && (
                <div className="flex items-center space-x-3 p-4 bg-base-200/50 rounded-xl">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-base-content">Email</div>
                    <div className="text-sm text-base-content/70">{profile.email}</div>
                  </div>
                </div>
              )}

              {profile?.phone && (
                <div className="flex items-center space-x-3 p-4 bg-base-200/50 rounded-xl">
                  <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <div className="font-semibold text-base-content">Phone</div>
                    <div className="text-sm text-base-content/70">{profile.phone}</div>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-primary btn-lg"
              >
                Get In Touch
              </button>
              
              {profile?.resume_url && (
                <a 
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-lg"
                >
                  Download CV
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
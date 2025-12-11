import { useState, useEffect } from 'react';
import { User, MapPin, Mail, Phone, ArrowRight } from 'lucide-react';
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
      setLoading(true);
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
        return;
      }
      setProfile(data);
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
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const stats = [
    { number: '5+', label: 'Years Experience' },
    { number: '50+', label: 'Projects Completed' },
    { number: '30+', label: 'Happy Clients' },
  ];

  const skills = [
    'Reading', 'Traveling', 'Photography', 'Cooking',
    'Gaming', 'Music', 'Sports', 'Writing'
  ];

  return (
    <section 
      id="about" 
      ref={elementRef}
      className="py-20 md:py-32 bg-base-100"
    >
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Section Header */}
        <motion.div 
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
            About Me
          </h2>
          <div className="w-20 h-1 bg-primary"></div>
        </motion.div>

        {/* Main Content */}
        <div className="grid xl:grid-cols-2 gap-16 xl:gap-20 2xl:gap-24 items-center mb-20">
          {/* Left Column - Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="relative">
              <div className="aspect-[2/1] rounded-2xl overflow-hidden bg-base-200 w-full max-w-2xl mx-auto shadow-xl">
                {(() => {
                  const imageUrl = profile?.about_image?.url || profile?.avatar_url;
                  const imageAlt = profile?.about_image?.alt_text || profile?.full_name || 'Profile';
                  
                  if (imageUrl) {
                    return (
                      <img 
                        src={imageUrl} 
                        alt={imageAlt}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    );
                  }
                  
                  return (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-32 h-32 text-base-content/20" />
                    </div>
                  );
                })()}
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -right-6 bg-base-100 rounded-xl shadow-xl p-6 border border-base-300">
                <div className="text-3xl font-bold text-primary mb-1">5+</div>
                <div className="text-sm text-base-content/70">Years of Experience</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            className="flex flex-col justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3 className="text-3xl font-bold text-base-content mb-2">
              {profile?.full_name || 'Full Stack Developer'}
            </h3>
            <p className="text-xl text-primary font-medium mb-6">
              {profile?.title || 'Web Developer'}
            </p>
            
            <p className="text-base-content/80 text-lg leading-relaxed mb-8">
              {profile?.bio || profile?.hero_description || 'I specialize in building modern web applications with clean code and intuitive user interfaces. With a strong foundation in both frontend and backend development, I create solutions that are not only functional but also scalable and maintainable.'}
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              {profile?.location && (
                <div className="flex items-center gap-3 text-base-content/70">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-3 text-base-content/70">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href={`mailto:${profile.email}`} className="hover:text-primary transition-colors">
                    {profile.email}
                  </a>
                </div>
              )}
              {profile?.phone && (
                <div className="flex items-center gap-3 text-base-content/70">
                  <Phone className="w-5 h-5 text-primary" />
                  <a href={`tel:${profile.phone}`} className="hover:text-primary transition-colors">
                    {profile.phone}
                  </a>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-primary"
              >
                Get In Touch
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              
              {profile?.resume_url && (
                <a 
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  Download CV
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-8 xl:gap-16 mb-20 py-12 border-y border-base-300"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-base-content/70">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Skills & Expertise */}
        <div className="grid xl:grid-cols-2 gap-16 xl:gap-20 2xl:gap-24">
          {/* Skills */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h4 className="text-2xl font-bold text-base-content mb-6">Personal Interests</h4>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-base-200 text-base-content rounded-lg font-medium hover:bg-base-300 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* What I Do */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h4 className="text-2xl font-bold text-base-content mb-6">What I Do</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-semibold text-base-content mb-1">Web Development</div>
                  <div className="text-base-content/70 text-sm">Building responsive and performant web applications</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-semibold text-base-content mb-1">UI/UX Design</div>
                  <div className="text-base-content/70 text-sm">Creating intuitive and beautiful user interfaces</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-semibold text-base-content mb-1">API Development</div>
                  <div className="text-base-content/70 text-sm">Designing and implementing robust backend systems</div>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
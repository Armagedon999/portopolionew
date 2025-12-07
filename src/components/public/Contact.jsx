import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { db } from '../../lib/supabase';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const Contact = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { elementRef, hasIntersected } = useIntersectionObserver();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

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

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const contactData = {
        ...data,
        ip_address: await fetch('https://api.ipify.org?format=json')
          .then(res => res.json())
          .then(data => data.ip)
          .catch(() => null),
        user_agent: navigator.userAgent,
      };

      const { error } = await db.createContact(contactData);
      if (error) throw error;

      toast.success('Message sent successfully! I\'ll get back to you soon.');
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
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
      id="contact" 
      ref={elementRef}
      className="section-padding bg-base-200/30 relative overflow-hidden"
    >
      {/* Premium Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full mesh-blob"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full mesh-blob"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          hasIntersected ? 'animate-fade-in' : 'opacity-0'
        }`}>
          <h2 className="text-heading gradient-text mb-4">
            Get In Touch
          </h2>
          <p className="text-body-lg text-base-content/70 max-w-2xl mx-auto">
            Ready to start your next project? Let's discuss how we can work together
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Contact Information */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-base-content mb-6">
                Let's Connect
              </h3>
              
              <p className="text-base-content/70 mb-8 leading-relaxed">
                I'm always interested in new opportunities and exciting projects. 
                Whether you have a question or just want to say hi, feel free to reach out!
              </p>

              <div className="space-y-4">
                {profile?.email && (
                  <div className="glass-card rounded-2xl p-4 hover-lift">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-base-content text-sm mb-1">Email</div>
                        <a 
                          href={`mailto:${profile.email}`}
                          className="text-base-content/70 hover:text-primary transition-colors text-sm break-all"
                        >
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {profile?.phone && (
                  <div className="glass-card rounded-2xl p-4 hover-lift">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary/30 to-accent/30 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                        <Phone className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <div className="font-semibold text-base-content text-sm mb-1">Phone</div>
                        <a 
                          href={`tel:${profile.phone}`}
                          className="text-base-content/70 hover:text-secondary transition-colors text-sm"
                        >
                          {profile.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {profile?.location && (
                  <div className="glass-card rounded-2xl p-4 hover-lift">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent/30 to-primary/30 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                        <MapPin className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold text-base-content text-sm mb-1">Location</div>
                        <div className="text-base-content/70 text-sm">{profile.location}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Response Time Card */}
            <div className="glass-card rounded-3xl p-6 bg-gradient-to-br from-success/10 to-primary/5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="font-semibold text-base-content mb-1">Quick Response</div>
                  <p className="text-base-content/70 text-sm">
                    I typically respond within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="glass-card rounded-3xl p-8 shadow-xl h-full">
              <h3 className="text-2xl font-bold text-base-content mb-6">
                Send a Message
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name *</span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full ${
                      errors.name ? 'input-error' : ''
                    }`}
                    placeholder="Your full name"
                    {...register('name', { 
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' }
                    })}
                  />
                  {errors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.name.message}</span>
                    </label>
                  )}
                </div>

                {/* Email Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email Address *</span>
                  </label>
                  <input
                    type="email"
                    className={`input input-bordered w-full ${
                      errors.email ? 'input-error' : ''
                    }`}
                    placeholder="your.email@example.com"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.email.message}</span>
                    </label>
                  )}
                </div>

                {/* Subject Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Subject</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="What's this about?"
                    {...register('subject')}
                  />
                </div>

                {/* Message Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Message *</span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered w-full h-32 resize-none ${
                      errors.message ? 'textarea-error' : ''
                    }`}
                    placeholder="Tell me about your project, ideas, or just say hello!"
                    {...register('message', { 
                      required: 'Message is required',
                      minLength: { value: 10, message: 'Message must be at least 10 characters' }
                    })}
                  />
                  {errors.message && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.message.message}</span>
                    </label>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-gradient w-full btn-lg shadow-lg hover:shadow-xl"
                >
                  {submitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
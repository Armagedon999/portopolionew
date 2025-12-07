import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Briefcase, 
  Mail, 
  TrendingUp, 
  Eye,
  Code,
  Star,
  Calendar,
  Image
} from 'lucide-react';
import { db } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    contacts: 0,
    unreadContacts: 0
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load stats with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const dataPromise = Promise.all([
        db.getProjects(true),
        db.getSkills(),
        db.getContacts()
      ]);

      const [projectsRes, skillsRes, contactsRes] = await Promise.race([
        dataPromise,
        timeoutPromise
      ]);

      const projects = projectsRes.data || [];
      const skills = skillsRes.data || [];
      const contacts = contactsRes.data || [];

      setStats({
        projects: projects.length,
        skills: skills.length,
        contacts: contacts.length,
        unreadContacts: contacts.filter(c => !c.is_read).length
      });

      // Set recent contacts (last 5)
      setRecentContacts(contacts.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set default values on error
      setStats({
        projects: 0,
        skills: 0,
        contacts: 0,
        unreadContacts: 0
      });
      setRecentContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.projects,
      icon: Briefcase,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
      change: '+2 this month'
    },
    {
      title: 'Skills',
      value: stats.skills,
      icon: Code,
      color: 'text-secondary',
      bgColor: 'bg-secondary/20',
      change: '+1 this week'
    },
    {
      title: 'Messages',
      value: stats.contacts,
      icon: Mail,
      color: 'text-accent',
      bgColor: 'bg-accent/20',
      change: `${stats.unreadContacts} unread`
    },
    {
      title: 'Portfolio Views',
      value: '1.2k',
      icon: Eye,
      color: 'text-success',
      bgColor: 'bg-success/20',
      change: '+15% this week'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-base-content mb-2">Dashboard</h1>
          <p className="text-base-content/70">
            Welcome back! Here's what's happening with your portfolio.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div
              key={stat.title}
              className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20 hover:shadow-xl transition-shadow animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-sm font-medium ${stat.color}`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-base-content mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-base-content/70">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Messages */}
          <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-base-content">Recent Messages</h2>
              <Link to="/admin/messages" className="btn btn-primary btn-sm">View All</Link>
            </div>

            <div className="space-y-4">
              {recentContacts.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
                  <p className="text-base-content/50">No messages yet</p>
                </div>
              ) : (
                recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-start space-x-3 p-4 rounded-lg transition-colors hover:bg-base-200/50 ${
                      !contact.is_read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      !contact.is_read ? 'bg-primary' : 'bg-base-300'
                    }`}>
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-base-content truncate">
                          {contact.name}
                        </h4>
                        <span className="text-xs text-base-content/50">
                          {formatDate(contact.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-base-content/70 truncate">
                        {contact.subject || 'No subject'}
                      </p>
                      <p className="text-xs text-base-content/50 truncate mt-1">
                        {contact.message}
                      </p>
                    </div>
                    {!contact.is_read && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20 animate-slide-up" style={{ animationDelay: '600ms' }}>
            <h2 className="text-xl font-bold text-base-content mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/portfolio" className="btn btn-outline btn-lg h-20 flex-col space-y-2 hover:btn-primary group">
                <Briefcase className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-sm">Manage Projects</span>
              </Link>
              
              <Link to="/admin/skills" className="btn btn-outline btn-lg h-20 flex-col space-y-2 hover:btn-secondary group">
                <Code className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-sm">Manage Skills</span>
              </Link>
              
              <Link to="/admin/images" className="btn btn-outline btn-lg h-20 flex-col space-y-2 hover:btn-accent group">
                <Image className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-sm">Manage Images</span>
              </Link>
              
              <Link to="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg h-20 flex-col space-y-2 hover:btn-success group">
                <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-sm">View Site</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-base-100 rounded-xl p-6 shadow-lg border border-base-300/20 animate-slide-up" style={{ animationDelay: '800ms' }}>
          <h2 className="text-xl font-bold text-base-content mb-6">Recent Activity</h2>
          
          <div className="space-y-4">
            {[
              {
                action: 'New message received',
                details: 'John Doe sent a project inquiry',
                time: '2 hours ago',
                icon: Mail,
                color: 'text-primary'
              },
              {
                action: 'Project updated',
                details: 'E-commerce Platform project was modified',
                time: '5 hours ago',
                icon: Briefcase,
                color: 'text-secondary'
              },
              {
                action: 'Skill added',
                details: 'Added React.js to skills list',
                time: '1 day ago',
                icon: Code,
                color: 'text-accent'
              },
              {
                action: 'Portfolio viewed',
                details: '15 new visitors this week',
                time: '2 days ago',
                icon: TrendingUp,
                color: 'text-success'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 hover:bg-base-200/50 rounded-lg transition-colors">
                <div className={`w-10 h-10 ${activity.color.replace('text-', 'bg-').replace('-', '/20 text-')} rounded-full flex items-center justify-center`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-base-content">{activity.action}</h4>
                  <p className="text-sm text-base-content/70">{activity.details}</p>
                </div>
                <div className="flex items-center space-x-1 text-xs text-base-content/50">
                  <Calendar className="w-3 h-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
import { useState, useEffect } from 'react';
import { Mail, Trash2, Eye, EyeOff, Calendar, User, MessageSquare, Reply } from 'lucide-react';
import { db } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data, error } = await db.getContacts();
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await db.updateContact(id, { is_read: true });
      await loadMessages();
      toast.success('Message marked as read');
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      await db.updateContact(id, { is_read: false });
      await loadMessages();
      toast.success('Message marked as unread');
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await db.deleteContact(id);
      await loadMessages();
      setSelectedMessage(null);
      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'unread') return !message.is_read;
    if (filter === 'read') return message.is_read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2">Messages</h1>
            <p className="text-base-content/70">
              Manage contact form submissions and inquiries
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="badge badge-primary">
              {unreadCount} unread
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({messages.length})
          </button>
          <button
            className={`tab ${filter === 'unread' ? 'tab-active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`tab ${filter === 'read' ? 'tab-active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read ({messages.length - unreadCount})
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-base-100 rounded-xl shadow-lg border border-base-300/20">
              <div className="p-4 border-b border-base-300/20">
                <h2 className="font-semibold text-base-content">Messages</h2>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="p-6 text-center">
                    <Mail className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
                    <p className="text-base-content/50">
                      {filter === 'all' ? 'No messages yet' : 
                       filter === 'unread' ? 'No unread messages' : 'No read messages'}
                    </p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border-b border-base-300/20 cursor-pointer hover:bg-base-200/50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-primary/10' : ''
                      } ${!message.is_read ? 'bg-primary/5' : ''}`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            !message.is_read ? 'bg-primary' : 'bg-base-300'
                          }`}>
                            {message.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-base-content text-sm">
                              {message.name}
                            </h4>
                            <p className="text-xs text-base-content/50">
                              {formatDate(message.created_at)}
                            </p>
                          </div>
                        </div>
                        {!message.is_read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      
                      {message.subject && (
                        <p className="text-sm font-medium text-base-content mb-1">
                          {message.subject}
                        </p>
                      )}
                      
                      <p className="text-sm text-base-content/70 line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-base-100 rounded-xl shadow-lg border border-base-300/20">
                <div className="p-6 border-b border-base-300/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        !selectedMessage.is_read ? 'bg-primary' : 'bg-base-300'
                      }`}>
                        {selectedMessage.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-base-content">
                          {selectedMessage.name}
                        </h2>
                        <p className="text-base-content/70">
                          {selectedMessage.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!selectedMessage.is_read ? (
                        <button
                          onClick={() => handleMarkAsRead(selectedMessage.id)}
                          className="btn btn-sm btn-outline"
                        >
                          <Eye className="w-4 h-4" />
                          Mark Read
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkAsUnread(selectedMessage.id)}
                          className="btn btn-sm btn-outline"
                        >
                          <EyeOff className="w-4 h-4" />
                          Mark Unread
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(selectedMessage.id)}
                        className="btn btn-sm btn-error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-base-content/70">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedMessage.created_at)}</span>
                    </div>
                    {selectedMessage.ip_address && (
                      <div className="flex items-center space-x-1">
                        <span>IP: {selectedMessage.ip_address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {selectedMessage.subject && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-base-content mb-2">Subject</h3>
                      <p className="text-base-content/80">{selectedMessage.subject}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-base-content mb-2">Message</h3>
                    <div className="bg-base-200/50 rounded-lg p-4">
                      <p className="text-base-content/80 whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`}
                      className="btn btn-primary"
                    >
                      <Reply className="w-4 h-4" />
                      Reply
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-base-100 rounded-xl shadow-lg border border-base-300/20 p-12 text-center">
                <MessageSquare className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-base-content mb-2">Select a Message</h3>
                <p className="text-base-content/70">
                  Choose a message from the list to view its details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Messages;
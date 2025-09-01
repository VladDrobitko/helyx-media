// src/pages/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import type { PageType } from '@/types';
import { PortfolioService, type PortfolioVideo } from '@/services/portfolioService';
import { ContactService, type ContactSubmission } from '@/services/contactService';
import { AddVideoModal } from '@/components/AddVideoModal';
import styles from './AdminPage.module.css';

interface AdminPageProps {
  setCurrentPage: (page: PageType) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ setCurrentPage }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'contacts'>('videos');
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [activeTab, isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'videos') {
        const videosData = await PortfolioService.getAllVideos();
        setVideos(videosData);
      } else {
        const contactsData = await ContactService.getAllSubmissions();
        setContacts(contactsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      const success = await PortfolioService.deleteVideo(id);
      if (success) {
        setVideos(prev => prev.filter(video => video.id !== id));
      }
    }
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    const success = await PortfolioService.updateVideo(id, { 
      is_published: !currentStatus 
    });
    if (success) {
      setVideos(prev => prev.map(video => 
        video.id === id ? { ...video, is_published: !currentStatus } : video
      ));
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    const success = await PortfolioService.updateVideo(id, { 
      is_featured: !currentStatus 
    });
    if (success) {
      setVideos(prev => prev.map(video => 
        video.id === id ? { ...video, is_featured: !currentStatus } : video
      ));
    }
  };

  const handleMarkContactRead = async (id: string) => {
    const success = await ContactService.markAsRead(id);
    if (success) {
      setContacts(prev => prev.map(contact => 
        contact.id === id ? { ...contact, is_read: true } : contact
      ));
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact submission?')) {
      const success = await ContactService.deleteSubmission(id);
      if (success) {
        setContacts(prev => prev.filter(contact => contact.id !== id));
      }
    }
  };

  const handleVideoAdded = (newVideo: PortfolioVideo) => {
    setVideos(prev => [newVideo, ...prev]);
    setIsAddVideoModalOpen(false);
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} setCurrentPage={setCurrentPage} />;
  }

  return (
    <div className={styles.adminContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button
            onClick={() => setCurrentPage('home')}
            className={styles.backButton}
          >
            ← Back to Site
          </button>
          <h1 className={styles.title}>Admin Panel</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem('admin_auth');
              setIsAuthenticated(false);
            }}
            className={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab('videos')}
          className={`${styles.tab} ${activeTab === 'videos' ? styles.active : ''}`}
        >
          Portfolio Videos ({videos.length})
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`${styles.tab} ${activeTab === 'contacts' ? styles.active : ''}`}
        >
          Contact Submissions ({contacts.filter(c => !c.is_read).length} new)
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : activeTab === 'videos' ? (
          <VideosTab 
            videos={videos} 
            onDelete={handleDeleteVideo}
            onTogglePublished={handleTogglePublished}
            onToggleFeatured={handleToggleFeatured}
            onAddVideo={() => setIsAddVideoModalOpen(true)}
          />
        ) : (
          <ContactsTab 
            contacts={contacts}
            onMarkRead={handleMarkContactRead}
            onDelete={handleDeleteContact}
          />
        )}
      </div>

      {/* Add Video Modal */}
      <AddVideoModal
        isOpen={isAddVideoModalOpen}
        onClose={() => setIsAddVideoModalOpen(false)}
        onVideoAdded={handleVideoAdded}
      />
    </div>
  );
};

// Videos Tab Component
const VideosTab: React.FC<{
  videos: PortfolioVideo[];
  onDelete: (id: string) => void;
  onTogglePublished: (id: string, current: boolean) => void;
  onToggleFeatured: (id: string, current: boolean) => void;
  onAddVideo: () => void;
}> = ({ videos, onDelete, onTogglePublished, onToggleFeatured, onAddVideo }) => {
  return (
    <div className={styles.videosTab}>
      <div className={styles.addVideoButton}>
        <button 
          className={styles.primaryButton}
          onClick={onAddVideo}
        >
          + Add New Video
        </button>
      </div>

      {videos.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No videos found</h3>
          <p>Start by adding your first portfolio video.</p>
        </div>
      ) : (
        <div className={styles.videoGrid}>
          {videos.map((video) => (
            <div key={video.id} className={styles.videoCard}>
              <div className={styles.videoThumbnail}>
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title}
                  className={styles.thumbnailImage}
                />
                <div className={styles.videoStatus}>
                  <span className={`${styles.badge} ${video.is_published ? styles.published : styles.draft}`}>
                    {video.is_published ? 'Published' : 'Draft'}
                  </span>
                  {video.is_featured && (
                    <span className={`${styles.badge} ${styles.featured}`}>
                      Featured
                    </span>
                  )}
                </div>
              </div>
              
              <div className={styles.videoInfo}>
                <h3 className={styles.videoTitle}>{video.title}</h3>
                <p className={styles.videoCategory}>{video.category} • {video.year}</p>
                <p className={styles.videoClient}>{video.client}</p>
                
                <div className={styles.videoActions}>
                  <button
                    onClick={() => onTogglePublished(video.id, video.is_published)}
                    className={styles.toggleButton}
                  >
                    {video.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => onToggleFeatured(video.id, video.is_featured)}
                    className={styles.toggleButton}
                  >
                    {video.is_featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => onDelete(video.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Contacts Tab Component
const ContactsTab: React.FC<{
  contacts: ContactSubmission[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ contacts, onMarkRead, onDelete }) => {
  return (
    <div className={styles.contactsTab}>
      {contacts.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No contact submissions</h3>
          <p>Contact submissions will appear here when users fill out the contact form.</p>
        </div>
      ) : (
        <div className={styles.contactsList}>
          {contacts.map((contact) => (
            <div 
              key={contact.id} 
              className={`${styles.contactCard} ${!contact.is_read ? styles.unread : ''}`}
            >
              <div className={styles.contactHeader}>
                <div className={styles.contactInfo}>
                  <h3 className={styles.contactName}>{contact.name}</h3>
                  <p className={styles.contactEmail}>{contact.email}</p>
                  {contact.company && (
                    <p className={styles.contactCompany}>{contact.company}</p>
                  )}
                </div>
                <div className={styles.contactMeta}>
                  <span className={styles.contactDate}>
                    {new Date(contact.created_at).toLocaleDateString()}
                  </span>
                  {!contact.is_read && (
                    <span className={styles.newBadge}>New</span>
                  )}
                </div>
              </div>
              
              <div className={styles.contactMessage}>
                <p>{contact.message}</p>
              </div>
              
              <div className={styles.contactActions}>
                {!contact.is_read && (
                  <button
                    onClick={() => onMarkRead(contact.id)}
                    className={styles.markReadButton}
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => onDelete(contact.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Login Form Component
const LoginForm: React.FC<{
  onLogin: () => void;
  setCurrentPage: (page: PageType) => void;
}> = ({ onLogin, setCurrentPage }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple password check - in production, use proper authentication
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
      sessionStorage.setItem('admin_auth', 'true');
      onLogin();
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.loginContainer}>
        <div className={styles.loginForm}>
          <button
            onClick={() => setCurrentPage('home')}
            className={styles.backButton}
          >
            ← Back to Site
          </button>
          
          <h1 className={styles.loginTitle}>Admin Access</h1>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Enter admin password"
                required
              />
            </div>
            
            {error && (
              <div className={styles.error}>{error}</div>
            )}
            
            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </form>
          
          <div className={styles.loginHint}>
            <p>Use admin password to access the panel</p>
          </div>
        </div>
      </div>
    </div>
  );
};

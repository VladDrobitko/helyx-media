// src/components/AddVideoModal/index.tsx
import React, { useState } from 'react';
import { PortfolioService, type PortfolioVideo } from '@/services/portfolioService';
import styles from './AddVideoModal.module.css';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoAdded: (video: PortfolioVideo) => void;
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({ 
  isOpen, 
  onClose, 
  onVideoAdded 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    client: '',
    year: new Date().getFullYear(),
    format: 'horizontal' as 'horizontal' | 'vertical' | 'square',
    is_published: false,
    is_featured: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In demo mode, create a demo video
      const newVideo: PortfolioVideo = {
        id: `demo-${Date.now()}`,
        ...formData,
        video_url: '/videos/heroBackground.mp4',
        thumbnail_url: '/images/portfolio1.jpg',
        order_index: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onVideoAdded(newVideo);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error adding video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      client: '',
      year: new Date().getFullYear(),
      format: 'horizontal',
      is_published: false,
      is_featured: false
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add New Video</h2>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="title" className={styles.label}>
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="category" className={styles.label}>
                Category *
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className={styles.input}
                placeholder="e.g. Commercial, Brand, Product"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="client" className={styles.label}>
                Client *
              </label>
              <input
                type="text"
                id="client"
                value={formData.client}
                onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="year" className={styles.label}>
                Year
              </label>
              <input
                type="number"
                id="year"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                className={styles.input}
                min="2020"
                max="2030"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="format" className={styles.label}>
                Format
              </label>
              <select
                id="format"
                value={formData.format}
                onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value as any }))}
                className={styles.select}
              >
                <option value="horizontal">Horizontal (16:9)</option>
                <option value="vertical">Vertical (9:16)</option>
                <option value="square">Square (1:1)</option>
              </select>
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                className={styles.checkbox}
              />
              Publish immediately
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                className={styles.checkbox}
              />
              Feature on homepage
            </label>
          </div>

          <div className={styles.note}>
            <p>Note: In demo mode, videos will use placeholder content. Connect Supabase to upload actual files.</p>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading || !formData.title || !formData.category || !formData.client}
            >
              {isLoading ? 'Adding...' : 'Add Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// src/components/AddVideoModal/index.tsx
import React, { useState } from 'react';
import { PortfolioService, type PortfolioVideo } from '@/services/portfolioService';
import { supabase } from '@/lib/supabase';
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
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(0);

    try {
      let videoUrl = '/videos/heroBackground.mp4'; // fallback
      let thumbnailUrl = '/images/portfolio1.jpg'; // fallback

      // If Supabase is configured and files are provided, upload them
      if (supabase && (videoFile || thumbnailFile)) {
        // Upload video file
        if (videoFile) {
          setUploadProgress(25);
          const videoFileName = `video-${Date.now()}-${videoFile.name}`;
          const { data: videoData, error: videoError } = await supabase.storage
            .from('videos')
            .upload(videoFileName, videoFile, {
              cacheControl: '3600',
              upsert: false
            });

          if (videoError) throw videoError;
          
          const { data: { publicUrl: videoPublicUrl } } = supabase.storage
            .from('videos')
            .getPublicUrl(videoFileName);
          
          videoUrl = videoPublicUrl;
          setUploadProgress(50);
        }

        // Upload thumbnail file
        if (thumbnailFile) {
          setUploadProgress(75);
          const thumbnailFileName = `thumb-${Date.now()}-${thumbnailFile.name}`;
          const { data: thumbnailData, error: thumbnailError } = await supabase.storage
            .from('thumbnails')
            .upload(thumbnailFileName, thumbnailFile, {
              cacheControl: '3600',
              upsert: false
            });

          if (thumbnailError) throw thumbnailError;
          
          const { data: { publicUrl: thumbnailPublicUrl } } = supabase.storage
            .from('thumbnails')
            .getPublicUrl(thumbnailFileName);
          
          thumbnailUrl = thumbnailPublicUrl;
        }
      }

      setUploadProgress(90);

      // Create video record in database
      const videoData: Omit<PortfolioVideo, 'id' | 'created_at' | 'updated_at'> = {
        ...formData,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        order_index: Date.now()
      };

      const newVideo = await PortfolioService.createVideo(videoData);
      
      if (!newVideo) {
        throw new Error('Failed to create video record');
      }

      setUploadProgress(100);
      onVideoAdded(newVideo);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Error uploading video: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
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
    setVideoFile(null);
    setThumbnailFile(null);
    setUploadProgress(0);
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

          {/* File Upload Section */}
          <div className={styles.fileUploadSection}>
            <h3 className={styles.sectionTitle}>Media Files</h3>
            
            <div className={styles.inputGroup}>
              <label htmlFor="videoFile" className={styles.label}>
                Video File {supabase ? '*' : '(Optional in demo mode)'}
              </label>
              <input
                type="file"
                id="videoFile"
                accept="video/mp4,video/webm,video/mov"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className={styles.fileInput}
              />
              {videoFile && (
                <div className={styles.fileInfo}>
                  Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} MB)
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="thumbnailFile" className={styles.label}>
                Thumbnail Image {supabase ? '*' : '(Optional in demo mode)'}
              </label>
              <input
                type="file"
                id="thumbnailFile"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className={styles.fileInput}
              />
              {thumbnailFile && (
                <div className={styles.fileInfo}>
                  Selected: {thumbnailFile.name} ({(thumbnailFile.size / 1024 / 1024).toFixed(1)} MB)
                </div>
              )}
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

          {uploadProgress > 0 && (
            <div className={styles.progressSection}>
              <div className={styles.progressLabel}>Uploading... {uploadProgress}%</div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className={styles.note}>
            <p>
              {supabase 
                ? "Upload video and thumbnail files to create your portfolio entry." 
                : "Note: In demo mode, videos will use placeholder content. Connect Supabase to upload actual files."
              }
            </p>
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
              disabled={
                isLoading || 
                !formData.title || 
                !formData.category || 
                !formData.client ||
                (supabase && !videoFile) ||
                (supabase && !thumbnailFile)
              }
            >
              {isLoading ? (uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Processing...') : 'Add Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

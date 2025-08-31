// src/components/VideoModal/index.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { VideoModalProps } from '@/types';
import styles from './VideoModal.module.css';

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoData }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Закрытие по ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Сброс состояния при открытии/закрытии
  useEffect(() => {
    const video = videoRef.current;
    if (isOpen && video && videoData) {
      video.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
    if (!isOpen && video) {
      video.pause();
      setIsPlaying(false);
    }
  }, [isOpen, videoData]);

  // Управление контролами
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  // Обработчики видео событий
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    setShowControls(true);
  }, []);

  // Управление воспроизведением
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }
  }, [isPlaying]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    const newVolume = parseFloat(e.target.value);
    if (video) {
      video.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      const newMuted = !isMuted;
      video.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (video && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * duration;
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [duration]);

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const handleVideoClick = useCallback(() => {
    togglePlay();
    resetControlsTimeout();
  }, [togglePlay, resetControlsTimeout]);

  const handleMouseMove = useCallback(() => {
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  if (!isOpen || !videoData) return null;

  return (
    <div className={styles.videoModalOverlay} onClick={onClose}>
      <div className={styles.videoModalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.videoModalHeader}>
          <div className={styles.videoModalTitle}>
            <h3>{videoData.title}</h3>
            <p>{videoData.category} • {videoData.year} • {videoData.client}</p>
          </div>
          <button 
            className={styles.videoModalClose} 
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Video Player */}
        <div 
          className={styles.videoPlayerContainer}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setShowControls(false)}
        >
          {videoData.videoUrl ? (
            <>
              <video
                ref={videoRef}
                className={styles.videoPlayer}
                src={videoData.videoUrl}
                poster={videoData.thumbnailUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={handlePlay}
                onPause={handlePause}
                onClick={handleVideoClick}
                preload="metadata"
                playsInline
                controls
              />
            </>
          ) : (
            <div className={styles.videoPlayOverlay}>
              <p style={{ color: 'white', textAlign: 'center' }}>
                Video preview not available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
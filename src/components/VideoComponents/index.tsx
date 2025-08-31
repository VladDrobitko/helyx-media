// src/components/VideoComponents/index.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { PortfolioVideoProps, VideoThumbnailProps } from '@/types';
import { videoMemoryManager } from '@/utils/VideoMemoryManager';
import styles from './VideoComponents.module.css';

// Простой компонент видео для портфолио (только для главной страницы)
export const PortfolioVideo: React.FC<PortfolioVideoProps> = ({ 
  src, 
  autoPlay = false,
  muted = true,
  loop = true,
  playsInline = true,
  ...props 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState<boolean>(false);
  const loopCountRef = useRef<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const currentVideo = videoRef.current;
    if (currentVideo) {
      observer.observe(currentVideo);
    }

    return () => {
      if (currentVideo) {
        observer.unobserve(currentVideo);
      }
    };
  }, []);

  // Автоплей при появлении в viewport
  useEffect(() => {
    const currentVideo = videoRef.current;
    if (!currentVideo) return;

    if (isInView && autoPlay) {
      currentVideo.play().catch(console.error);
    } else if (!isInView) {
      currentVideo.pause();
    }
  }, [isInView, autoPlay]);

  // Очистка памяти каждые 5 циклов
  const handleEnded = useCallback(() => {
    loopCountRef.current += 1;
    
    if (loopCountRef.current >= 5) {
      setTimeout(() => {
        const video = videoRef.current;
        if (video) {
          video.pause();
          video.removeAttribute('src');
          video.load();
          
          setTimeout(() => {
            video.src = src;
            video.load();
            if (isInView && autoPlay) {
              video.play().catch(console.error);
            }
            loopCountRef.current = 0;
          }, 100);
        }
      }, 50);
    }
  }, [src, isInView, autoPlay]);

  useEffect(() => {
    const currentVideo = videoRef.current;
    if (currentVideo) {
      videoMemoryManager.addVideo(currentVideo);
      
      return () => {
        videoMemoryManager.removeVideo(currentVideo);
      };
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className={styles.portfolioVideo}
      onEnded={handleEnded}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload="metadata"
      {...props}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};

// Компонент статического превью для страницы портфолио
export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ item, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(item);
  }, [item, onClick]);

  const backgroundStyle: React.CSSProperties = {
    background: item.videoUrl 
      ? `url('assets/thumbnails/${item.title.toLowerCase().replace(/\s+/g, '-')}.jpg'), ${item.gradient}`
      : item.gradient,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div 
      className={styles.videoThumbnail}
      onClick={handleClick}
      style={backgroundStyle}
    >
      {item.videoUrl && (
        <div className={styles.playOverlay}>
          <div className={styles.playButton}>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
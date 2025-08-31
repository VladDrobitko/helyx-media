// src/components/HeroSection/HeroSection.tsx
import React, { useRef, useEffect, useState } from 'react';
import { getVideoUrl } from '@/utils/supabaseUrls';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = React.memo(({ className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Обработчик загрузки метаданных
  const handleLoadedMetadata = () => {
    console.log('Video metadata loaded');
    const video = videoRef.current;
    if (video) {
      console.log('Video duration:', video.duration);
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
      console.log('Video ready state:', video.readyState);
    }
    setIsLoaded(true);
    setHasError(false);
  };

  // Обработчик ошибок
  const handleVideoError = (e: any) => {
    console.error('Hero video failed to load:', e);
    setHasError(true);
    setIsLoaded(false);
  };

  // Обработчик готовности к воспроизведению
  const handleCanPlay = () => {
    console.log('Video can play');
    setIsLoaded(true);
    setHasError(false);
  };

  // Обработчик начала воспроизведения
  const handlePlay = () => {
    console.log('Video started playing');
    setIsLoaded(true);
  };

  // Инициализация видео
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('Setting up video...');
    
    // Настраиваем свойства видео
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.loop = true;
    
    // Попытка воспроизведения
    const playVideo = async () => {
      try {
        console.log('Attempting to play video...');
        await video.play();
        console.log('Video started playing successfully');
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to play video:', error);
        setHasError(true);
      }
    };

    // Попытка воспроизведения после загрузки
    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener('canplay', playVideo, { once: true });
    }

    // Fallback: попробовать воспроизвести через 2 секунды
    const fallbackTimer = setTimeout(() => {
      if (!isLoaded && !hasError) {
        console.log('Fallback: trying to play video...');
        playVideo();
      }
    }, 2000);

    return () => {
      clearTimeout(fallbackTimer);
      video.removeEventListener('canplay', playVideo);
    };
  }, [isLoaded, hasError]);

  return (
    <section 
      id="hero" 
      className={`${styles.hero} ${className || ''}`}
    >
      {/* Видео фон */}
      <video
        ref={videoRef}
        className={styles.heroVideo}
        autoPlay
        muted
        loop
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleVideoError}
        onCanPlay={handleCanPlay}
        onPlay={handlePlay}
        poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2NjdlZWE7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOGI1Y2Y2O3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3NjRiYTI7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkaWVudCkiIC8+Cjwvc3ZnPg=="
      >
        <source src={getVideoUrl('heroBackground')} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Отображение ошибки если видео не загрузилось */}
      {hasError && (
        <div className={styles.videoError}>
          <p>Video background unavailable</p>
          <p>Error loading video files</p>
        </div>
      )}
      
      {/* Индикатор загрузки */}
      {!isLoaded && !hasError && (
        <div className={styles.videoLoading}>
          <div className={styles.loadingSpinner} />
          <p>Loading video...</p>
        </div>
      )}
    </section>
  );
});
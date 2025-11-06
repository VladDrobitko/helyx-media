// src/pages/PortfolioPage.tsx
import React, { useState, useEffect } from 'react';
import type { PageType, VideoItem } from '@/types';
import { PortfolioService } from '@/services/portfolioService';
import { getVideoUrl, getThumbnailUrl } from '@/utils/supabaseUrls';
import styles from './PortfolioPage.module.css';

interface PortfolioPageProps {
  setCurrentPage: (page: PageType) => void;
  onVideoClick: (video: VideoItem) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ 
  setCurrentPage, 
  onVideoClick 
}) => {
  const [portfolioItems, setPortfolioItems] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback статические данные для разработки
  const fallbackPortfolioItems: VideoItem[] = [
    {
      id: '1',
      category: 'Commercial',
      title: 'Ваш проект 1',
      description: 'Описание вашего первого проекта.',
      gradient: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      videoUrl: getVideoUrl('portfolioVideo1'),
      thumbnailUrl: getThumbnailUrl('video1Poster'),
      duration: '2:30',
      year: '2024',
      client: 'Ваш клиент',
      format: 'horizontal'
    },
    {
      id: '2',
      category: 'Brand Video',
      title: 'Ваш проект 2',
      description: 'Описание вашего второго проекта.',
      gradient: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      videoUrl: getVideoUrl('portfolioHeroBackground'),
      thumbnailUrl: getThumbnailUrl('heroBackgroundPoster'),
      duration: '1:45',
      year: '2024',
      client: 'Ваш клиент',
      format: 'vertical'
    },
    {
      id: '3',
      category: 'Motion Design',
      title: 'Ваш проект 3',
      description: 'Описание вашего третьего проекта.',
      gradient: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      videoUrl: getVideoUrl('portfolioVideo2'),
      thumbnailUrl: getThumbnailUrl('video2Poster'),
      duration: '3:15',
      year: '2023',
      client: 'Ваш клиент',
      format: 'horizontal'
    },
    {
      id: '4',
      category: 'Corporate',
      title: 'Ваш проект 4',
      description: 'Описание вашего четвертого проекта.',
      gradient: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      videoUrl: getVideoUrl('portfolioVideo1'),
      thumbnailUrl: getThumbnailUrl('video1Poster'),
      duration: '1:50',
      year: '2024',
      client: 'Ваш клиент',
      format: 'square'
    },
    {
      id: '5',
      category: 'Social Media',
      title: 'Ваш проект 5',
      description: 'Описание вашего пятого проекта.',
      gradient: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      videoUrl: getVideoUrl('portfolioHeroBackground'),
      thumbnailUrl: getThumbnailUrl('heroBackgroundPoster'),
      duration: '0:45',
      year: '2024',
      client: 'Ваш клиент',
      format: 'vertical'
    },
    {
      id: '6',
      category: 'Documentary',
      title: 'Ваш проект 6',
      description: 'Описание вашего шестого проекта.',
      gradient: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      videoUrl: getVideoUrl('portfolioVideo2'),
      thumbnailUrl: getThumbnailUrl('video2Poster'),
      duration: '4:20',
      year: '2023',
      client: 'Ваш клиент',
      format: 'horizontal'
    }
  ];

  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        const videos = await PortfolioService.getPublishedVideos();
        
        if (videos && videos.length > 0) {
          // Преобразуем данные из Supabase в формат VideoItem
          const videoItems: VideoItem[] = videos.map(video => ({
            id: video.id,
            category: video.category,
            title: video.title,
            description: video.description,
            gradient: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            videoUrl: video.video_url,
            thumbnailUrl: video.thumbnail_url,
            duration: video.duration || '0:00',
            year: video.year.toString(),
            client: video.client,
            format: video.format
          }));
          setPortfolioItems(videoItems);
        } else {
          // Если нет данных из БД, используем fallback
          setPortfolioItems(fallbackPortfolioItems);
        }
      } catch (error) {
        console.error('Error loading portfolio:', error);
        // Fallback к статическим данным если БД недоступна
        setPortfolioItems(fallbackPortfolioItems);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioData();
  }, []);

  // Функция для получения grid стилей с учетом формата видео
  const getGridStyles = (index: number, format: string) => {
    // Динамическое размещение с учетом формата
    const isHorizontal = format === 'horizontal';
    const isVertical = format === 'vertical';
    
    // Базовая логика: 3 видео в ряд
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    let gridColumn: string;
    let gridRow: string;
    
    if (isHorizontal) {
      // Горизонтальные видео (16:9) - занимают 4 колонки
      gridColumn = `${col * 4 + 1} / ${col * 4 + 5}`;
      gridRow = `${row * 3 + 1} / ${row * 3 + 3}`;
    } else if (isVertical) {
      // Вертикальные видео (9:16) - занимают 4 колонки, но больше по высоте
      gridColumn = `${col * 4 + 1} / ${col * 4 + 5}`;
      gridRow = `${row * 4 + 1} / ${row * 4 + 5}`;
    } else {
      // Квадратные видео (1:1) - занимают 4 колонки
      gridColumn = `${col * 4 + 1} / ${col * 4 + 5}`;
      gridRow = `${row * 2 + 1} / ${row * 2 + 3}`;
    }
    
    return { gridColumn, gridRow };
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a',
      color: 'white',
      paddingTop: '100px'
    }}>
      {/* Header с кнопкой "Назад" */}
      <div style={{ 
        padding: '2rem', 
        maxWidth: '1400px', 
        margin: '0 auto',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setCurrentPage('home')}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '0.75rem 1.5rem',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          ← Back to Home
        </button>
      </div>

      {/* Заголовок страницы */}
      <div style={{ 
        padding: '0 2rem', 
        maxWidth: '1400px', 
        margin: '0 auto',
        marginBottom: '4rem'
      }}>
        <h1 style={{ 
          fontSize: '4rem', 
          textAlign: 'center', 
          fontWeight: '300',
          letterSpacing: '-0.025em',
          marginBottom: '1rem'
        }}>
          Complete Portfolio
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          textAlign: 'center', 
          opacity: 0.7,
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Explore our full collection of creative video productions across various industries and formats.
        </p>
      </div>

      {/* Основная сетка портфолио */}
      <div style={{ 
        padding: '0 2rem 5rem', 
        maxWidth: '1400px', 
        margin: '0 auto'
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            <div style={{
              fontSize: '1.2rem',
              textAlign: 'center'
            }}>
              Loading portfolio...
            </div>
          </div>
        ) : portfolioItems.length === 0 ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center'
          }}>
            <div>
              <h3 style={{ marginBottom: '1rem' }}>No videos available</h3>
              <p>Videos will appear here once uploaded through the admin panel.</p>
            </div>
          </div>
        ) : (
          <div className={styles.portfolioGrid}>
            {portfolioItems.map((item, index) => {
              const gridStyles = getGridStyles(index, item.format);
              
              return (
                <div key={item.id} className={styles.portfolioItem} style={gridStyles}>
                  {/* Video Container */}
                  <div
                    className={styles.videoContainer}
                    onClick={() => onVideoClick(item)}
                    onMouseEnter={(e) => {
                      const video = e.currentTarget.querySelector('video');
                      if (video && video.paused) {
                        video.play().catch(err => console.log('Play prevented:', err));
                      }
                    }}
                    onMouseLeave={(e) => {
                      const video = e.currentTarget.querySelector('video');
                      if (video && !video.paused) {
                        video.pause();
                        video.currentTime = 0;
                      }
                    }}
                  >
                    {/* Video Player */}
                    <video
                      className={styles.video}
                      src={item.videoUrl}
                      poster={item.thumbnailUrl}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onError={(e) => {
                        console.error('Video load error:', item.title, e);
                        // Скрываем видео и показываем постер как background
                        const video = e.currentTarget;
                        video.style.display = 'none';
                        const container = video.parentElement;
                        if (container) {
                          container.style.backgroundImage = `url(${item.thumbnailUrl})`;
                          container.style.backgroundSize = 'cover';
                          container.style.backgroundPosition = 'center';
                        }
                      }}
                    />
                    
                    {/* Play Button Overlay */}
                    <div className={styles.playOverlay}>
                      <div className={styles.playIcon} />
                    </div>

                    {/* Video Info Overlay */}
                    <div className={styles.infoOverlay}>
                      <p className={styles.infoCategory}>
                        {item.category} • {item.year}
                      </p>
                      <h3 className={styles.infoTitle}>
                        {item.title}
                      </h3>
                      <p className={styles.infoMeta}>
                        {item.duration} • {item.client}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

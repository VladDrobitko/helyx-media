// src/components/PortfolioSection/index.tsx
import React from 'react';
import type { PageType, VideoItem } from '@/types';
import { getVideoUrl, getThumbnailUrl } from '@/utils/supabaseUrls';
import styles from './PortfolioSection.module.css';

interface PortfolioSectionProps {
  setCurrentPage: (page: PageType) => void;
  onVideoClick: (video: VideoItem) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ 
  setCurrentPage, 
  onVideoClick 
}) => {
  // Function to get grid styles for 3 videos layout
  const getGridStyles = (index: number) => {
    const layouts = [
      // Left side: Two horizontal videos stacked
      { gridColumn: '1 / 8', gridRow: '1 / 5' }, // Top horizontal (16:9)
      { gridColumn: '1 / 8', gridRow: '5 / 9' }, // Bottom horizontal (16:9)
      
      // Right side: One vertical video
      { gridColumn: '8 / 13', gridRow: '1 / 9' }, // Vertical (9:16)
    ];
    
    return layouts[index] || { gridColumn: '1 / 5', gridRow: '1 / 3' };
  };
  
  const portfolioItems: VideoItem[] = [
    {
      id: '1',
      category: 'Commercial',
      title: 'Cinematic tattoo promo',
      description: 'Dynamic working process in tattoo studio in Germany with talented artist @izuminka.tt',
      gradient: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      videoUrl: getVideoUrl('portfolioVideo1'),
      thumbnailUrl: getThumbnailUrl('video1Poster'),
      duration: '2:30',
      year: '2024',
      client: 'Fineline',
      format: 'horizontal'
    },
    {
      id: '2',
      category: 'Promo',
      title: 'Promo of Barcelona',
      description: 'One day in beautiful Barcelona',
      gradient: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      videoUrl: getVideoUrl('portfolioHeroBackground'),
      thumbnailUrl: getThumbnailUrl('heroBackgroundPoster'),
      duration: '1:45',
      year: '2024',
      client: '',
      format: 'vertical'
    },
    {
      id: '3',
      category: 'Sport',
      title: 'Sporty Girl',
      description: 'Sport is our healthy life.',
      gradient: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      videoUrl: getVideoUrl('portfolioVideo2'),
      thumbnailUrl: getThumbnailUrl('video2Poster'),
      duration: '3:15',
      year: '2023',
      client: '@izuminka.tt',
      format: 'horizontal'
    }
  ];

  return (
    <section id="portfolio" className={styles.portfolioSection}>
      <div className={styles.portfolioContainer}>
        <h2 className={styles.portfolioTitle}>
          Featured Work
        </h2>
        
        <div className={styles.portfolioGrid}>
          {portfolioItems.map((item, index) => {
            const gridStyles = getGridStyles(index);
            
            return (
              <div 
                key={item.id} 
                className={styles.portfolioItem}
                style={gridStyles}
              >
                <div
                  className={styles.videoContainer}
                  onClick={() => onVideoClick(item)}
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
                  />
                  
                  {/* Play Button Overlay */}
                  <div className={styles.playOverlay}>
                    <div className={styles.playIcon} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

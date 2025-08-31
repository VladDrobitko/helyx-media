// src/App.tsx
import React, { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { VideoModal } from '@/components/VideoModal';
import { ServicesSection } from '@/components/ServicesSection';
import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';
import { PortfolioPage } from '@/pages/PortfolioPage';
import { AdminPage } from '@/pages/AdminPage';
import { getVideoUrl, getThumbnailUrl } from '@/utils/supabaseUrls';
import type { PageType, VideoItem } from '@/types';
import './App.css';

// Portfolio Section Component
const PortfolioSection: React.FC<{ 
  setCurrentPage: (page: PageType) => void;
  onVideoClick: (video: VideoItem) => void;
}> = ({ setCurrentPage, onVideoClick }) => {
  
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
    }
  ];

  return (
    <section id="portfolio" style={{ 
      padding: '5rem 2rem', 
      background: '#0a0a0a', 
      scrollMarginTop: '100px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem', color: 'white', fontWeight: '300' }}>
          Featured Work
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(9, 80px)',
          gap: '2rem',
          marginBottom: '1rem',
          width: '100%'
        }}>
          {portfolioItems.map((item, index) => {
            const gridStyles = getGridStyles(index);
            
            return (
              <div key={item.id} style={{ ...gridStyles, position: 'relative' }}>
                {/* Video Container */}
                <div
                  onClick={() => onVideoClick(item)}
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  {/* Video Player */}
                  <video
                    src={item.videoUrl}
                    poster={item.thumbnailUrl}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '12px'
                    }}
                  />
                  
                  {/* Play Button Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60px',
                    height: '60px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0';
                  }}
                  >
                    <div style={{
                      width: 0,
                      height: 0,
                      borderLeft: '15px solid white',
                      borderTop: '10px solid transparent',
                      borderBottom: '10px solid transparent',
                      marginLeft: '3px'
                    }} />
                  </div>
                </div>
                

              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => setCurrentPage('portfolio')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '1rem 2rem',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
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
            View Complete Portfolio →
          </button>
        </div>
      </div>
    </section>
  );
};

// Contact Section Component
const ContactSection: React.FC = () => {
  return (
    <section id="contact" style={{ 
      padding: '5rem 2rem', 
      background: '#0a0a0a',
      color: 'white',
      scrollMarginTop: '100px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '300', letterSpacing: '-0.025em' }}>
            Let's Create Together
          </h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.7, maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Ready to bring your vision to life? Tell us about your project and we'll get back to you within 24 hours.
          </p>
        </div>
        
        <ContactForm />
      </div>
    </section>
  );
};



// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Update page title based on current page
  React.useEffect(() => {
    const titles = {
      home: 'HELYX Media',
      portfolio: 'Portfolio | HELYX Media',
      admin: 'Admin Panel | HELYX Media'
    };
    document.title = titles[currentPage];
  }, [currentPage]);

  const handleVideoClick = useCallback((video: VideoItem) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  }, []);

  const renderPage = useCallback(() => {
    switch(currentPage) {
      case 'portfolio':
        return <PortfolioPage setCurrentPage={setCurrentPage} onVideoClick={handleVideoClick} />;
      case 'admin':
        return <AdminPage setCurrentPage={setCurrentPage} />;
      case 'home':
      default:
        return (
          <>
            <HeroSection />
            <ServicesSection />
            <PortfolioSection 
              setCurrentPage={setCurrentPage} 
              onVideoClick={handleVideoClick}
            />
            <ContactSection />
          </>
        );
    }
  }, [currentPage, handleVideoClick]);

  return (
    <div className="App">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>{renderPage()}</main>
      <Footer />
      
      {/* Video Modal */}
      <VideoModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        videoData={selectedVideo}
      />
    </div>
  );
}

export default App;
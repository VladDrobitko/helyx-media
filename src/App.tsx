// src/App.tsx
import React, { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { VideoModal } from '@/components/VideoModal';
import { ServicesSection } from '@/components/ServicesSection';
import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';
import { PortfolioSection } from '@/components/PortfolioSection';
import { PortfolioPage } from '@/pages/PortfolioPage';
import { AdminPage } from '@/pages/AdminPage';
import { FAVICON_URL } from '@/utils/supabaseUrls';
import type { PageType, VideoItem } from '@/types';
import './App.css';

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

  // Update page title and favicon based on current page
  React.useEffect(() => {
    const titles = {
      home: 'HELYX Media',
      portfolio: 'Portfolio | HELYX Media',
      admin: 'Admin Panel | HELYX Media'
    };
    document.title = titles[currentPage];

    // Update favicon to use Supabase URL if available
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://demo.supabase.co') {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = FAVICON_URL;
      }
    }
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
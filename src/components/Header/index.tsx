// src/components/Header/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import type { HeaderProps, PageType } from '@/types';
import styles from './Header.module.css';

export const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerHeight = 80; // Примерная высота header
          const elementPosition = element.offsetTop - headerHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerHeight = 80; // Примерная высота header
        const elementPosition = element.offsetTop - headerHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }
    setIsMobileMenuOpen(false);
  }, [currentPage, setCurrentPage]);

  const navigateToPage = useCallback((page: PageType) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentPage]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const handleLogoClick = useCallback(() => {
    scrollToSection('hero');
  }, [scrollToSection]);

  const handleGetQuoteClick = useCallback(() => {
    scrollToSection('contact');
  }, [scrollToSection]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        <div 
          className={styles.logo}
          onClick={handleLogoClick}
        >
          <span className={styles.logoMain}>
            HEL<span className={styles.highlight}>Y</span>X
          </span>
          <span className={styles.logoMedia}>media</span>
        </div>
        
        <ul className={`${styles.navLinks} ${isMobileMenuOpen ? styles.active : ''}`}>
          <li>
            <button
              className={styles.navLink}
              onClick={() => scrollToSection('hero')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={styles.navLink}
              onClick={() => scrollToSection('services')}
            >
              Services
            </button>
          </li>
          <li>
            <button
              className={styles.navLink}
              onClick={() => navigateToPage('portfolio')}
            >
              Portfolio
            </button>
          </li>
          <li>
            <button
              className={styles.navLink}
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </button>
          </li>
        </ul>
        
        <div 
          className={styles.mobileMenuToggle}
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <button 
          className={styles.ctaButton}
          onClick={handleGetQuoteClick}
        >
          Get Quote
        </button>
      </nav>
    </header>
  );
};
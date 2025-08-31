// src/types/index.ts
// Основные типы для приложения

export interface VideoItem {
  id?: string;
  category: string;
  title: string;
  description: string;
  gradient: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration: string;
  year: string;
  client: string;
  format?: 'horizontal' | 'vertical' | 'square';
}

export interface ServiceItem {
  title: string;
  brief: string;
  features: string[];
  description: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  service: string;
  budget?: string;
  timeline?: string;
  message: string;
}

export interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoData: VideoItem | null;
}

export interface VideoThumbnailProps {
  item: VideoItem;
  onClick: (item: VideoItem) => void;
}

export interface PortfolioVideoProps {
  src: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
}

export interface HeaderProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
}

export interface PortfolioPageProps {
  setCurrentPage: (page: PageType) => void;
}

export interface PortfolioSectionProps {
  setCurrentPage: (page: PageType) => void;
}

export type PageType = 'home' | 'portfolio' | 'admin';

export type ServiceType = 'video-editing' | 'video-production' | 'motion-design' | 'consultation';

export type BudgetRange = 'under-1k' | '1k-5k' | '5k-10k' | '10k-plus' | 'discuss';

export type Timeline = 'asap' | '1-2-weeks' | '3-4-weeks' | '1-2-months' | 'flexible';
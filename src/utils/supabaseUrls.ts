// src/utils/supabaseUrls.ts
// Utility functions for Supabase Storage URLs

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';

// Generate Supabase Storage URL
export const getSupabaseFileUrl = (bucket: string, fileName: string): string => {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
};

// Video URLs
export const VIDEO_URLS = {
  // Hero video
  heroBackground: getSupabaseFileUrl('videos', 'hero-background.webm'),
  
  // Portfolio videos
  portfolioHeroBackground: getSupabaseFileUrl('videos', 'hero-background.webm'), // same as hero
  portfolioVideo1: getSupabaseFileUrl('videos', 'video1.webm'),
  portfolioVideo2: getSupabaseFileUrl('videos', 'video2.webm'),
};

// Thumbnail URLs
export const THUMBNAIL_URLS = {
  heroBackgroundPoster: getSupabaseFileUrl('thumbnails', 'hero-background-poster.jpeg'),
  video1Poster: getSupabaseFileUrl('thumbnails', 'video1-poster.jpeg'),
  video2Poster: getSupabaseFileUrl('thumbnails', 'video2-poster.jpeg'),
};

// Favicon URL
export const FAVICON_URL = getSupabaseFileUrl('thumbnails', 'favicon.ico');

// Get favicon URL with fallback
export const getFaviconUrl = (): string => {
  if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co') {
    return '/favicon.ico';
  }
  return FAVICON_URL;
};

// Fallback to local files if Supabase is not configured
export const getVideoUrl = (videoKey: keyof typeof VIDEO_URLS): string => {
  if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co') {
    // Fallback to local files
    const localUrls = {
      heroBackground: '/videos/hero-background.webm',
      portfolioHeroBackground: '/videos/portfolio/hero-background.webm',
      portfolioVideo1: '/videos/portfolio/video1.webm',
      portfolioVideo2: '/videos/portfolio/video2.webm',
    };
    return localUrls[videoKey];
  }
  return VIDEO_URLS[videoKey];
};

export const getThumbnailUrl = (thumbnailKey: keyof typeof THUMBNAIL_URLS): string => {
  if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co') {
    // Fallback to local files
    const localUrls = {
      heroBackgroundPoster: '/images/portfolio/hero-background-poster.jpeg',
      video1Poster: '/images/portfolio/video1-poster.jpeg',
      video2Poster: '/images/portfolio/video2-poster.jpeg',
    };
    return localUrls[thumbnailKey];
  }
  return THUMBNAIL_URLS[thumbnailKey];
};

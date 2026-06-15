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

// Fallback to public CDN files if Supabase is not configured
export const getVideoUrl = (videoKey: keyof typeof VIDEO_URLS): string => {
  if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co') {
    // Fallback to public stock videos (Mixkit CDN)
    const localUrls = {
      heroBackground: 'https://assets.mixkit.co/videos/preview/mixkit-urban-city-traffic-at-night-41584-large.mp4',
      portfolioHeroBackground: 'https://assets.mixkit.co/videos/preview/mixkit-urban-city-traffic-at-night-41584-large.mp4',
      portfolioVideo1: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-tattoo-artist-working-42247-large.mp4',
      portfolioVideo2: 'https://assets.mixkit.co/videos/preview/mixkit-girl-running-on-the-beach-at-sunset-39803-large.mp4',
    };
    return localUrls[videoKey];
  }
  return VIDEO_URLS[videoKey];
};

export const getThumbnailUrl = (thumbnailKey: keyof typeof THUMBNAIL_URLS): string => {
  if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co') {
    // Fallback to public images (Unsplash CDN)
    const localUrls = {
      heroBackgroundPoster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
      video1Poster: 'https://images.unsplash.com/photo-1598104358684-f4b4576cbb34?w=800&auto=format&fit=crop&q=80',
      video2Poster: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    };
    return localUrls[thumbnailKey];
  }
  return THUMBNAIL_URLS[thumbnailKey];
};

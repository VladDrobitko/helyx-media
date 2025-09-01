// src/services/portfolioService.ts
import { supabase, type PortfolioVideo } from '@/lib/supabase';

export class PortfolioService {
  // Получить все опубликованные видео
  static async getPublishedVideos(): Promise<PortfolioVideo[]> {
    try {
      if (!supabase) {
        // Fallback к статическим данным для разработки
        console.warn('Supabase not configured, using fallback data');
        return [];
      }

      const { data, error } = await supabase
        .from('portfolio_videos')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching portfolio videos:', error);
      return [];
    }
  }

  // Получить featured видео (для главной страницы)
  static async getFeaturedVideos(limit: number = 3): Promise<PortfolioVideo[]> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured, using fallback data');
        return [];
      }

      const { data, error } = await supabase
        .from('portfolio_videos')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('order_index', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured videos:', error);
      return [];
    }
  }

  // Получить видео по ID
  static async getVideoById(id: string): Promise<PortfolioVideo | null> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured');
        return null;
      }

      const { data, error } = await supabase
        .from('portfolio_videos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching video by ID:', error);
      return null;
    }
  }

  // Админские функции
  static async getAllVideos(): Promise<PortfolioVideo[]> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured, using demo data');
        // Demo data for development
        return [
          {
            id: 'demo-1',
            title: 'Demo Commercial Video',
            description: 'A showcase of premium commercial videography',
            category: 'Commercial',
            client: 'Demo Client',
            year: 2024,
            video_url: '/videos/heroBackground.mp4',
            thumbnail_url: '/images/portfolio1.jpg',
            format: 'horizontal' as const,
            is_published: true,
            is_featured: true,
            order_index: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'demo-2',
            title: 'Brand Story Video',
            description: 'Creative storytelling for modern brands',
            category: 'Brand',
            client: 'Creative Agency',
            year: 2024,
            video_url: '/videos/heroBackground.mp4',
            thumbnail_url: '/images/portfolio2.jpg',
            format: 'vertical' as const,
            is_published: true,
            is_featured: false,
            order_index: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'demo-3',
            title: 'Product Showcase',
            description: 'Professional product videography',
            category: 'Product',
            client: 'Tech Company',
            year: 2024,
            video_url: '/videos/heroBackground.mp4',
            thumbnail_url: '/images/portfolio3.jpg',
            format: 'square' as const,
            is_published: false,
            is_featured: false,
            order_index: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }

      const { data, error } = await supabase
        .from('portfolio_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all videos:', error);
      return [];
    }
  }

  static async createVideo(video: Omit<PortfolioVideo, 'id' | 'created_at' | 'updated_at'>): Promise<PortfolioVideo | null> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured, creating demo video');
        // In demo mode, return a mock video with the provided data
        return {
          id: `demo-${Date.now()}`,
          ...video,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }

      const { data, error } = await supabase
        .from('portfolio_videos')
        .insert([video])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating video:', error);
      return null;
    }
  }

  static async updateVideo(id: string, updates: Partial<PortfolioVideo>): Promise<boolean> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured, simulating update');
        // In demo mode, just return success
        return true;
      }

      const { data, error } = await supabase
        .from('portfolio_videos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating video:', error);
      return false;
    }
  }

  static async deleteVideo(id: string): Promise<boolean> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured, simulating delete');
        return true;
      }

      const { error } = await supabase
        .from('portfolio_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  }

  // Загрузка файлов
  static async uploadVideo(file: File, fileName: string): Promise<string | null> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured');
        return null;
      }

      const { data, error } = await supabase.storage
        .from('videos')
        .upload(fileName, file);

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading video:', error);
      return null;
    }
  }

  static async uploadThumbnail(file: File, fileName: string): Promise<string | null> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured');
        return null;
      }

      const { data, error } = await supabase.storage
        .from('thumbnails')
        .upload(fileName, file);

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      return null;
    }
  }
}

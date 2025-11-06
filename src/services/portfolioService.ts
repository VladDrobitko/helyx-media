import { supabase, type PortfolioVideo } from '@/lib/supabase';

export class PortfolioService {
  static async getPublishedVideos(): Promise<PortfolioVideo[]> {
    try {
      if (!supabase?.from) {
        console.warn('Supabase not configured');
        return [];
      }

      const { data, error } = await supabase
        .from('portfolio_videos')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (error) throw error;

      return (data || []).map(v => ({
        ...v,
        videoUrl: v.video_url,
        thumbnailUrl: v.thumbnail_url,
      }));
    } catch (error) {
      console.error('Error fetching portfolio videos:', error);
      return [];
    }
  }

  static async getFeaturedVideos(limit: number = 3): Promise<PortfolioVideo[]> {
    try {
      if (!supabase?.from) return [];
      const { data, error } = await supabase
        .from('portfolio_videos')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('order_index', { ascending: true })
        .limit(limit);
      if (error) throw error;
      return (data || []).map(v => ({
        ...v,
        videoUrl: v.video_url,
        thumbnailUrl: v.thumbnail_url,
      }));
    } catch (error) {
      console.error('Error fetching featured videos:', error);
      return [];
    }
  }

  static async getVideoById(id: string): Promise<PortfolioVideo | null> {
    try {
      if (!supabase?.from) return null;
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

  static async getAllVideos(): Promise<PortfolioVideo[]> {
    try {
      if (!supabase?.from) return [];
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
      if (!supabase?.from) return null;
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
      if (!supabase?.from) return true;
      const { error } = await supabase
        .from('portfolio_videos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating video:', error);
      return false;
    }
  }

  static async deleteVideo(id: string): Promise<boolean> {
    try {
      if (!supabase?.from) return true;
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

  static async uploadVideo(file: File, fileName: string): Promise<string | null> {
    try {
      if (!supabase?.storage) return null;
      const { error } = await supabase.storage
        .from('videos')
        .upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('videos').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading video:', error);
      return null;
    }
  }

  static async uploadThumbnail(file: File, fileName: string): Promise<string | null> {
    try {
      if (!supabase?.storage) return null;
      const { error } = await supabase.storage
        .from('thumbnails')
        .upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('thumbnails').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      return null;
    }
  }
}

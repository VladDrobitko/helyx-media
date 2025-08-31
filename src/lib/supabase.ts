// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Проверяем, настроены ли переменные окружения
const isSupabaseConfigured = 
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://demo.supabase.co';

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Типы для базы данных
export interface PortfolioVideo {
  id: string;
  title: string;
  description: string;
  category: string;
  video_url: string;
  thumbnail_url: string;
  duration: string;
  year: string;
  client: string;
  format: 'horizontal' | 'vertical' | 'square';
  created_at: string;
  updated_at: string;
  order_index: number;
  is_featured: boolean;
  is_published: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

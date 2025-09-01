-- HELYX Media Supabase Database Setup
-- Run this script in your Supabase SQL Editor

-- Create portfolio_videos table
CREATE TABLE IF NOT EXISTS portfolio_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  client TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  video_url TEXT,
  thumbnail_url TEXT,
  format TEXT NOT NULL CHECK (format IN ('horizontal', 'vertical', 'square')),
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for portfolio_videos
CREATE TRIGGER update_portfolio_videos_updated_at 
  BEFORE UPDATE ON portfolio_videos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE portfolio_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for portfolio_videos
-- Allow public read access to published videos
CREATE POLICY "Public can view published videos" ON portfolio_videos
  FOR SELECT USING (is_published = true);

-- Allow admin full access (you'll need to create admin user)
CREATE POLICY "Admin can do everything with videos" ON portfolio_videos
  FOR ALL USING (auth.jwt()->>'email' = 'your-admin@email.com');

-- Policies for contact_submissions  
-- Allow public insert (for contact form)
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Allow admin read/update/delete access
CREATE POLICY "Admin can manage contact submissions" ON contact_submissions
  FOR ALL USING (auth.jwt()->>'email' = 'your-admin@email.com');

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('videos', 'videos', true),
  ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for videos bucket
CREATE POLICY "Public can view videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Admin can upload videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'videos' AND 
    auth.jwt()->>'email' = 'your-admin@email.com'
  );

CREATE POLICY "Admin can update videos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'videos' AND 
    auth.jwt()->>'email' = 'your-admin@email.com'
  );

CREATE POLICY "Admin can delete videos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'videos' AND 
    auth.jwt()->>'email' = 'your-admin@email.com'
  );

-- Storage policies for thumbnails bucket
CREATE POLICY "Public can view thumbnails" ON storage.objects
  FOR SELECT USING (bucket_id = 'thumbnails');

CREATE POLICY "Admin can upload thumbnails" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'thumbnails' AND 
    auth.jwt()->>'email' = 'your-admin@email.com'
  );

CREATE POLICY "Admin can update thumbnails" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'thumbnails' AND 
    auth.jwt()->>'email' = 'your-admin@email.com'
  );

CREATE POLICY "Admin can delete thumbnails" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'thumbnails' AND 
    auth.jwt()->>'email' = 'your-admin@email.com'
  );

-- Insert some sample data (optional)
INSERT INTO portfolio_videos (
  title, description, category, client, year, format, 
  is_published, is_featured, order_index
) VALUES 
  (
    'Sample Commercial Video',
    'A showcase of premium commercial videography',
    'Commercial',
    'Sample Client',
    2024,
    'horizontal',
    true,
    true,
    1
  ),
  (
    'Brand Story Example',
    'Creative storytelling for modern brands',
    'Brand',
    'Creative Agency',
    2024,
    'vertical',
    true,
    false,
    2
  ),
  (
    'Product Showcase Demo',
    'Professional product videography',
    'Product',
    'Tech Company',
    2024,
    'square',
    false,
    false,
    3
  )
ON CONFLICT DO NOTHING;
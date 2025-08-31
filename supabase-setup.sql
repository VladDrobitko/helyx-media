-- Supabase Setup SQL
-- Создание таблиц и настройка безопасности

-- Включаем Row Level Security (RLS)
-- Создаем таблицу для портфолио видео
CREATE TABLE portfolio_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    duration TEXT NOT NULL,
    year TEXT NOT NULL,
    client TEXT NOT NULL,
    format TEXT CHECK (format IN ('horizontal', 'vertical', 'square')) DEFAULT 'horizontal',
    order_index INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для контактных обращений
CREATE TABLE contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Настройка Row Level Security
ALTER TABLE portfolio_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Политики для portfolio_videos
-- Все могут читать опубликованные видео
CREATE POLICY "Anyone can view published videos" ON portfolio_videos
    FOR SELECT USING (is_published = true);

-- Только аутентифицированные пользователи могут управлять всеми видео
CREATE POLICY "Authenticated users can manage videos" ON portfolio_videos
    FOR ALL USING (auth.role() = 'authenticated');

-- Политики для contact_submissions
-- Все могут создавать обращения
CREATE POLICY "Anyone can create contact submissions" ON contact_submissions
    FOR INSERT WITH CHECK (true);

-- Только аутентифицированные пользователи могут читать и управлять обращениями
CREATE POLICY "Authenticated users can manage submissions" ON contact_submissions
    FOR ALL USING (auth.role() = 'authenticated');

-- Создаем индексы для оптимизации
CREATE INDEX idx_portfolio_videos_published ON portfolio_videos (is_published);
CREATE INDEX idx_portfolio_videos_featured ON portfolio_videos (is_featured);
CREATE INDEX idx_portfolio_videos_order ON portfolio_videos (order_index);
CREATE INDEX idx_contact_submissions_created ON contact_submissions (created_at);
CREATE INDEX idx_contact_submissions_read ON contact_submissions (is_read);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_portfolio_videos_updated_at 
    BEFORE UPDATE ON portfolio_videos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Создание storage buckets для файлов
-- Выполните эти команды в Supabase Dashboard > Storage
-- INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);

-- Политики для storage (выполните в Storage > Policies)
-- CREATE POLICY "Anyone can view videos" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
-- CREATE POLICY "Authenticated users can upload videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated users can update videos" ON storage.objects FOR UPDATE USING (bucket_id = 'videos' AND auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated users can delete videos" ON storage.objects FOR DELETE USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- CREATE POLICY "Anyone can view thumbnails" ON storage.objects FOR SELECT USING (bucket_id = 'thumbnails');
-- CREATE POLICY "Authenticated users can upload thumbnails" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated users can update thumbnails" ON storage.objects FOR UPDATE USING (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated users can delete thumbnails" ON storage.objects FOR DELETE USING (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');

-- Вставляем тестовые данные
INSERT INTO portfolio_videos (
    title, description, category, video_url, thumbnail_url, 
    duration, year, client, format, order_index, is_featured, is_published
) VALUES 
(
    'Sample Project 1', 
    'This is a sample horizontal video project for testing.',
    'Commercial',
    '/videos/portfolio/video1.webm',
    '/images/portfolio/video1-poster.jpeg',
    '2:30',
    '2024',
    'Sample Client',
    'horizontal',
    1,
    true,
    true
),
(
    'Sample Project 2',
    'This is a sample vertical video project for testing.',
    'Social Media',
    '/videos/portfolio/hero-background.webm',
    '/images/portfolio/hero-background-poster.jpeg',
    '1:45',
    '2024',
    'Sample Client',
    'vertical',
    2,
    true,
    true
),
(
    'Sample Project 3',
    'This is a sample square video project for testing.',
    'Motion Design',
    '/videos/portfolio/video2.webm',
    '/images/portfolio/video2-poster.jpeg',
    '3:15',
    '2023',
    'Sample Client',
    'square',
    3,
    true,
    true
);
